# ⚡ Быстрая настройка проекта

## 🚀 Автоматическая настройка (рекомендуется)

```powershell
# Запустите скрипт автоматической настройки
.\setup-project.ps1
```

## 🔧 Ручная настройка

### 1. Настройка адреса комиссии
```bash
# Откройте файл .env
notepad .env

# Замените эти строки:
COMMISSION_ADDRESS=UQ_YOUR_COMMISSION_ADDRESS_HERE
COMMISSION_ADDRESS_HEX=YOUR_HEX_ADDRESS_HERE

# На ваши реальные значения:
COMMISSION_ADDRESS=UQCcGsNjHAoznOnu2ZFHdSZtsjDosYrLLOhhoZWwyKkzumQ_
COMMISSION_ADDRESS_HEX=9c1ac3631c0a339ce9eed99147752...
```

### 2. Получение hex адреса
```javascript
// Через Node.js
const { Address } = require('@ton/core');
const addr = Address.parse('UQCcGsNjHAoznOnu2ZFHdSZtsjDosYrLLOhhoZWwyKkzumQ_');
console.log(addr.hash.toString('hex'));
```

### 3. Проверка настройки
```bash
cd token-contract
npm test
```

## ✅ Проверка готовности

После настройки проект должен пройти все проверки:
- [x] Файл .env создан и настроен
- [x] Зависимости установлены
- [x] Адрес комиссии настроен
- [x] Тесты проходят
- [x] Контракт компилируется

## 🎯 Деплой

### Testnet (рекомендуется сначала)
```bash
# В .env установите:
TON_NETWORK=testnet

# Запустите деплой
cd token-contract
npm run deploy
```

### Mainnet (только после тестирования)
```bash
# В .env установите:
TON_NETWORK=mainnet

# Запустите деплой
cd token-contract
npm run deploy
```

## 🆘 Если что-то не работает

1. **Ошибки зависимостей**: `npm install --legacy-peer-deps`
2. **Ошибки компиляции**: Проверьте настройку адреса в .env
3. **Ошибки тестов**: Убедитесь, что адрес комиссии корректный
4. **Ошибки деплоя**: Проверьте баланс кошелька и сеть

---
**Время настройки: ~5 минут** 