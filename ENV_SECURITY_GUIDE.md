# 🔒 Руководство по безопасности переменных окружения

## 🎯 Обзор

Все чувствительные данные проекта теперь хранятся в файле `.env`. Это обеспечивает безопасность и гибкость конфигурации.

## 📋 Обязательные переменные

### Критически важные (обязательны для работы):
```bash
COMMISSION_ADDRESS=UQCcGsNjHAoznOnu2ZFHdSZtsjDosYrLLOhhoZWwyKkzumQ_
COMMISSION_ADDRESS_HEX=9c1ac3631c0a339ce9eed99147752...
```

### Для деплоя:
```bash
DEPLOYMENT_MNEMONIC="word1 word2 word3 ... word24"
TON_NETWORK=testnet
```

## 🛡️ Правила безопасности

### 1. Файл .env
- ✅ **НИКОГДА** не коммитьте `.env` в Git
- ✅ Используйте `.env.example` как шаблон
- ✅ Создавайте отдельные `.env` для разных сред
- ✅ Ограничьте права доступа: `chmod 600 .env`

### 2. Приватные ключи
- ✅ Используйте мнемоники вместо приватных ключей
- ✅ Храните резервные копии в безопасном месте
- ✅ Никогда не передавайте ключи по незащищенным каналам
- ✅ Используйте разные кошельки для testnet и mainnet

### 3. Адреса комиссии
- ✅ Проверяйте адрес перед каждым деплоем
- ✅ Используйте multisig для больших сумм
- ✅ Мониторьте поступления комиссий
- ✅ Ведите учет всех транзакций

## 🔧 Настройка окружения

### 1. Создание .env файла
```bash
# Копируем шаблон
cp .env.example .env

# Устанавливаем права доступа
chmod 600 .env

# Редактируем конфигурацию
nano .env
```

### 2. Генерация hex адреса
```bash
# Через TON CLI
ton-cli convert-address UQCcGsNjHAoznOnu2ZFHdSZtsjDosYrLLOhhoZWwyKkzumQ_

# Через Node.js
node -e "
const { Address } = require('@ton/core');
const addr = Address.parse('UQCcGsNjHAoznOnu2ZFHdSZtsjDosYrLLOhhoZWwyKkzumQ_');
console.log(addr.hash.toString('hex'));
"
```

### 3. Проверка конфигурации
```bash
# Запуск тестов для проверки
npm test lottery-test.ts

# Проверка компиляции
cd token-contract/ft && bash compile.sh
```

## 🚨 Проверки перед деплоем

### Чек-лист безопасности:
- [ ] `.env` файл настроен и не в Git
- [ ] `COMMISSION_ADDRESS` - ваш контролируемый адрес
- [ ] `COMMISSION_ADDRESS_HEX` соответствует адресу
- [ ] Мнемоника кошелька сохранена в безопасном месте
- [ ] Тестирование прошло успешно в testnet
- [ ] Адрес комиссии имеет достаточно TON для операций
- [ ] Настроен мониторинг поступлений

### Команды проверки:
```bash
# Проверка переменных окружения
node -e "
require('dotenv').config();
console.log('Commission:', process.env.COMMISSION_ADDRESS);
console.log('Network:', process.env.TON_NETWORK);
console.log('Hex length:', process.env.COMMISSION_ADDRESS_HEX?.length);
"

# Проверка формата адреса
node -e "
require('dotenv').config();
const { Address } = require('@ton/core');
try {
  Address.parse(process.env.COMMISSION_ADDRESS);
  console.log('✅ Address format valid');
} catch(e) {
  console.log('❌ Invalid address format');
}
"
```

## 🔄 Смена адреса комиссии

### Процедура обновления:
1. **Обновите .env файл**
2. **Перекомпилируйте контракт**
3. **Протестируйте в testnet**
4. **Задеплойте новую версию**

```bash
# 1. Обновляем .env
nano .env

# 2. Перекомпилируем
cd token-contract/ft
bash compile.sh

# 3. Тестируем
npm test

# 4. Деплоим
npx blueprint run deployJettonMinter
```

## 📊 Мониторинг

### Настройка алертов:
```bash
# В .env добавьте
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Для мониторинга поступлений
TON_API_KEY=your_api_key
```

### Скрипт мониторинга:
```javascript
// monitor.js
require('dotenv').config();
const { TonClient } = require('@ton/ton');

async function monitorCommission() {
  const client = new TonClient({
    endpoint: process.env.TON_API_ENDPOINT
  });
  
  const address = process.env.COMMISSION_ADDRESS;
  // Логика мониторинга...
}
```

## 🆘 Экстренные процедуры

### При компрометации ключей:
1. **Немедленно** переведите средства на новый адрес
2. Обновите `COMMISSION_ADDRESS` в `.env`
3. Перекомпилируйте и передеплойте контракты
4. Уведомите пользователей о смене адреса

### При ошибке в адресе:
1. Проверьте поступления на неправильный адрес
2. Если возможно, верните средства пользователям
3. Исправьте адрес и передеплойте
4. Документируйте инцидент

## 📚 Дополнительные ресурсы

- [TON Security Best Practices](https://ton.org/docs/develop/security)
- [Environment Variables Security](https://12factor.net/config)
- [TON Wallet Security](https://ton.org/docs/participate/wallets/apps)

---

**⚠️ Помните**: Безопасность - это процесс, а не состояние. Регулярно проверяйте и обновляйте конфигурацию. 