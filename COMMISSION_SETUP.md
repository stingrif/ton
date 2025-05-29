# Настройка адреса комиссии

## 🎯 Обзор

Перед деплоем смарт-контракта необходимо настроить адрес для сбора комиссий.

## 📝 Пошаговая инструкция

### 1. Получите свой TON адрес
- Создайте кошелек в TON Keeper, Tonhub или другом кошельке
- Скопируйте адрес в формате: `UQxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2. Конвертируйте адрес в hex
```bash
# Используйте TON утилиты или онлайн конвертер
# Пример: UQCcGsNjHAoznOnu2ZFHdSZtsjDosYrLLOhhoZWwyKkzumQ_
# Hex: 9c1ac3631c0a339ce9eed99147752...
```

### 3. Обновите код контракта
Откройте файл `token-contract/ft/jetton-wallet.fc` и замените:

```func
;; TODO: Replace with your commission address
slice commission_address() asm "x{YOUR_HEX_ADDRESS_HERE} PUSHSLICE";
```

На:
```func
;; Your commission address
slice commission_address() asm "x{9c1ac3631c0a339ce9eed99147752...} PUSHSLICE";
```

### 4. Обновите тесты
В файле `token-contract/lottery-test.ts` замените:
```typescript
const commissionAddress = 'UQ_YOUR_COMMISSION_ADDRESS_HERE';
```

На ваш реальный адрес:
```typescript
const commissionAddress = 'UQCcGsNjHAoznOnu2ZFHdSZtsjDosYrLLOhhoZWwyKkzumQ_';
```

## ⚠️ Важные замечания

1. **Безопасность**: Убедитесь, что у вас есть доступ к приватным ключам адреса комиссии
2. **Тестирование**: Сначала протестируйте в testnet
3. **Резервное копирование**: Сохраните seed фразу кошелька комиссии
4. **Мониторинг**: Настройте отслеживание поступлений комиссий

## 🔧 Утилиты для конвертации

### Онлайн конвертеры:
- TON Address Converter
- TON Utils

### Программные утилиты:
```bash
# Через TON CLI
ton-cli convert-address UQCcGsNjHAoznOnu2ZFHdSZtsjDosYrLLOhhoZWwyKkzumQ_

# Через Node.js
import { Address } from '@ton/core';
const addr = Address.parse('UQCcGsNjHAoznOnu2ZFHdSZtsjDosYrLLOhhoZWwyKkzumQ_');
console.log(addr.hash.toString('hex'));
```

## 📊 Проверка настройки

После настройки проверьте:
1. Компиляция контракта без ошибок
2. Прохождение всех тестов
3. Корректность адреса в тестах
4. Доступность кошелька комиссии

---

**Следующий шаг**: Компиляция и тестирование контракта 