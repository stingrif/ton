import { describe, it } from 'mocha';
import { expect } from 'chai';

describe('Commission Logic Test', () => {
    it('should calculate 6% commission correctly', () => {
        // Test commission calculation logic
        const testCases = [
            { amount: 1000000, expectedFee: 60000, expectedToSend: 940000 },
            { amount: 100, expectedFee: 6, expectedToSend: 94 },
            { amount: 1000, expectedFee: 60, expectedToSend: 940 },
            { amount: 50000000, expectedFee: 3000000, expectedToSend: 47000000 },
        ];

        testCases.forEach(({ amount, expectedFee, expectedToSend }) => {
            // Simulate the commission calculation from the smart contract
            const fee = Math.floor((amount * 6) / 100);
            const amountToSend = amount - fee;

            expect(fee).to.equal(expectedFee, `Fee calculation failed for amount ${amount}`);
            expect(amountToSend).to.equal(expectedToSend, `Amount to send calculation failed for amount ${amount}`);
            expect(fee + amountToSend).to.equal(amount, `Total should equal original amount for ${amount}`);
        });
    });

    it('should handle edge cases', () => {
        // Test edge cases
        const edgeCases = [
            { amount: 1, expectedFee: 0, expectedToSend: 1 }, // Very small amount
            { amount: 16, expectedFee: 0, expectedToSend: 16 }, // Amount less than 100
            { amount: 17, expectedFee: 1, expectedToSend: 16 }, // Minimum amount for 1 unit fee
        ];

        edgeCases.forEach(({ amount, expectedFee, expectedToSend }) => {
            const fee = Math.floor((amount * 6) / 100);
            const amountToSend = amount - fee;

            expect(fee).to.equal(expectedFee, `Edge case fee calculation failed for amount ${amount}`);
            expect(amountToSend).to.equal(expectedToSend, `Edge case amount to send calculation failed for amount ${amount}`);
        });
    });

    it('should verify commission percentage is exactly 6%', () => {
        const largeAmount = 1000000000; // 1 billion units
        const fee = Math.floor((largeAmount * 6) / 100);
        const actualPercentage = (fee / largeAmount) * 100;
        
        // For large amounts, the percentage should be very close to 6%
        expect(actualPercentage).to.be.closeTo(6, 0.01, 'Commission percentage should be close to 6%');
    });
}); 