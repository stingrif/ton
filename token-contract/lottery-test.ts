import { describe, it } from 'mocha';
import { expect } from 'chai';
import { config } from 'dotenv';

// Load environment variables
config();

describe('Lottery and Commission Logic Test', () => {
    const COMMISSION_RATE = 6; // 6%
    const LOTTERY_BONUS_RATE = 2; // 2%
    const LOTTERY_CHANCE = 66; // 1/66

    // Get commission address from environment
    const getCommissionAddress = (): string => {
        const address = process.env.COMMISSION_ADDRESS;
        if (!address || address === 'UQ_YOUR_COMMISSION_ADDRESS_HERE') {
            throw new Error('COMMISSION_ADDRESS must be set in .env file for testing');
        }
        return address;
    };

    it('should calculate commission correctly', () => {
        const testCases = [
            { amount: 1000000, expectedFee: 60000, expectedToSend: 940000 },
            { amount: 100, expectedFee: 6, expectedToSend: 94 },
            { amount: 1000, expectedFee: 60, expectedToSend: 940 },
            { amount: 50000000, expectedFee: 3000000, expectedToSend: 47000000 },
        ];

        testCases.forEach(({ amount, expectedFee, expectedToSend }) => {
            const fee = Math.floor((amount * COMMISSION_RATE) / 100);
            const amountToSend = amount - fee;

            expect(fee).to.equal(expectedFee, `Fee calculation failed for amount ${amount}`);
            expect(amountToSend).to.equal(expectedToSend, `Amount to send calculation failed for amount ${amount}`);
        });
    });

    it('should calculate lottery bonus correctly', () => {
        const testCases = [
            { baseAmount: 940000, expectedBonus: 18800 }, // 2% of 940000
            { baseAmount: 94, expectedBonus: 1 }, // 2% of 94 (rounded down)
            { baseAmount: 940, expectedBonus: 18 }, // 2% of 940
            { baseAmount: 47000000, expectedBonus: 940000 }, // 2% of 47000000
        ];

        testCases.forEach(({ baseAmount, expectedBonus }) => {
            const bonus = Math.floor((baseAmount * LOTTERY_BONUS_RATE) / 100);
            expect(bonus).to.equal(expectedBonus, `Bonus calculation failed for base amount ${baseAmount}`);
        });
    });

    it('should calculate total amount with lottery win', () => {
        const originalAmount = 1000000;
        const fee = Math.floor((originalAmount * COMMISSION_RATE) / 100); // 60000
        const baseAmountToSend = originalAmount - fee; // 940000
        const lotteryBonus = Math.floor((baseAmountToSend * LOTTERY_BONUS_RATE) / 100); // 18800
        const totalWithBonus = baseAmountToSend + lotteryBonus; // 958800

        expect(fee).to.equal(60000);
        expect(baseAmountToSend).to.equal(940000);
        expect(lotteryBonus).to.equal(18800);
        expect(totalWithBonus).to.equal(958800);

        // Проверяем, что общая сумма не превышает исходную + бонус
        expect(totalWithBonus).to.be.lessThan(originalAmount);
        expect(totalWithBonus).to.equal(originalAmount * 0.9588); // 95.88%
    });

    it('should verify lottery probability', () => {
        // Симуляция лотереи
        const simulations = 66000; // Большое количество для статистики
        let wins = 0;

        for (let i = 0; i < simulations; i++) {
            // Имитируем rand(66) == 0
            const randomValue = Math.floor(Math.random() * LOTTERY_CHANCE);
            if (randomValue === 0) {
                wins++;
            }
        }

        const winRate = wins / simulations;
        const expectedRate = 1 / LOTTERY_CHANCE; // ≈ 0.01515

        // Проверяем, что частота выигрышей близка к ожидаемой (с погрешностью)
        expect(winRate).to.be.closeTo(expectedRate, 0.005, 'Win rate should be close to 1/66');
        
        console.log(`Симуляция: ${wins} выигрышей из ${simulations} попыток`);
        console.log(`Частота: ${(winRate * 100).toFixed(3)}% (ожидается: ${(expectedRate * 100).toFixed(3)}%)`);
    });

    it('should handle edge cases for small amounts', () => {
        const edgeCases = [
            { amount: 1, expectedFee: 0, expectedToSend: 1, expectedBonus: 0 },
            { amount: 16, expectedFee: 0, expectedToSend: 16, expectedBonus: 0 },
            { amount: 17, expectedFee: 1, expectedToSend: 16, expectedBonus: 0 },
            { amount: 100, expectedFee: 6, expectedToSend: 94, expectedBonus: 1 },
        ];

        edgeCases.forEach(({ amount, expectedFee, expectedToSend, expectedBonus }) => {
            const fee = Math.floor((amount * COMMISSION_RATE) / 100);
            const amountToSend = amount - fee;
            const bonus = Math.floor((amountToSend * LOTTERY_BONUS_RATE) / 100);

            expect(fee).to.equal(expectedFee, `Fee failed for amount ${amount}`);
            expect(amountToSend).to.equal(expectedToSend, `Amount to send failed for amount ${amount}`);
            expect(bonus).to.equal(expectedBonus, `Bonus failed for amount ${amount}`);
        });
    });

    it('should verify commission address from environment', () => {
        const commissionAddress = getCommissionAddress();
        
        // Базовые проверки формата TON адреса
        expect(commissionAddress).to.match(/^UQ[A-Za-z0-9_-]{46}$/);
        expect(commissionAddress.length).to.equal(48);
        expect(commissionAddress.startsWith('UQ')).to.be.true;
        expect(commissionAddress).to.not.equal('UQ_YOUR_COMMISSION_ADDRESS_HERE');
        
        console.log('✅ Адрес комиссии из .env:', commissionAddress);
    });

    it('should validate environment configuration', () => {
        // Проверяем обязательные переменные окружения
        const requiredVars = [
            'COMMISSION_ADDRESS',
            'COMMISSION_ADDRESS_HEX'
        ];

        requiredVars.forEach(varName => {
            const value = process.env[varName];
            expect(value).to.exist(`${varName} must be set in .env file`);
            expect(value).to.not.equal(`${varName.replace('COMMISSION_', 'UQ_YOUR_').replace('_HEX', '')}_HERE`);
        });

        // Проверяем hex адрес
        const hexAddress = process.env.COMMISSION_ADDRESS_HEX;
        expect(hexAddress).to.match(/^[0-9a-fA-F]{64}$/, 'COMMISSION_ADDRESS_HEX must be 64 hex characters');
        
        console.log('✅ Все переменные окружения настроены корректно');
    });
}); 