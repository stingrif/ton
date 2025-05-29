# 🚀 Руководство по деплою Jetton Wallet с комиссией и лотереей

## 📋 Обзор проекта

Jetton Wallet с:
- **6% комиссия** с каждого перевода
- **Лотерея 1/66** с бонусом +2%
- **Настраиваемый адрес комиссии**: `UQ_YOUR_COMMISSION_ADDRESS_HERE`

⚠️ **Важно**: Перед деплоем замените адрес комиссии в файле `ft/jetton-wallet.fc`

## 🔧 Настройка виртуальной среды

### 1. Установка TON Development Tools

#### Вариант A: Docker (рекомендуется)
```bash
# Создать Dockerfile
cat > Dockerfile << EOF
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \\
    build-essential \\
    cmake \\
    clang \\
    openssl \\
    libssl-dev \\
    zlib1g-dev \\
    gperf \\
    wget \\
    git \\
    curl \\
    libreadline-dev \\
    ccache \\
    libmicrohttpd-dev \\
    pkg-config \\
    libsodium-dev \\
    python3 \\
    python3-pip \\
    nodejs \\
    npm

# Установка TON
WORKDIR /ton
RUN git clone --recurse-submodules https://github.com/ton-blockchain/ton.git . \\
    && mkdir build \\
    && cd build \\
    && cmake -DCMAKE_BUILD_TYPE=Release .. \\
    && cmake --build . -j4

ENV PATH="/ton/build:$PATH"
ENV FIFTPATH="/ton/crypto/fift/lib"

WORKDIR /workspace
EOF

# Сборка образа
docker build -t ton-dev .

# Запуск контейнера
docker run -it -v $(pwd):/workspace ton-dev bash
```

#### Вариант B: Blueprint Framework
```bash
# Установка Blueprint
npm install -g @ton-community/blueprint

# Создание нового проекта
npx blueprint create jetton-wallet-commission
cd jetton-wallet-commission

# Копирование файлов
cp ../ft/jetton-wallet.fc contracts/
cp ../lottery-test.ts tests/
cp ../commission-test.ts tests/
```

### 2. Локальная установка (Ubuntu/WSL)

```bash
# Установка зависимостей
sudo apt update
sudo apt install -y build-essential cmake clang openssl libssl-dev zlib1g-dev gperf wget git curl libreadline-dev ccache libmicrohttpd-dev pkg-config libsodium-dev

# Клонирование и сборка TON
git clone --recurse-submodules https://github.com/ton-blockchain/ton.git
cd ton
mkdir build && cd build
cmake -DCMAKE_BUILD_TYPE=Release ..
cmake --build . -j$(nproc)

# Добавление в PATH
echo 'export PATH="$HOME/ton/build:$PATH"' >> ~/.bashrc
echo 'export FIFTPATH="$HOME/ton/crypto/fift/lib"' >> ~/.bashrc
source ~/.bashrc
```

## 🏗️ Компиляция и тестирование

### 1. Проверка инструментов
```bash
func -V  # Должен показать версию >= 0.2.0
fift -V  # Должен показать информацию о сборке
```

### 2. Компиляция контракта
```bash
# Через Blueprint
npx blueprint build

# Или напрямую
func -APS -o jetton-wallet.fif ft/jetton-wallet.fc
fift -s jetton-wallet.fif
```

### 3. Запуск тестов
```bash
# Тесты логики
npm test lottery-test.ts
npm test commission-test.ts

# Все тесты
npm test
```

## 🌐 Деплой в testnet

### 1. Настройка кошелька
```bash
# Создание кошелька для тестов
npx blueprint run

# Или через tonkeeper testnet
# Получить тестовые TON: https://t.me/testgiver_ton_bot
```

### 2. Деплой контракта
```bash
# Деплой Jetton Minter
npx blueprint run deployJettonMinter

# Деплой Jetton Wallet (автоматически при первом переводе)
```

### 3. Проверка функций
```bash
# Проверка комиссии
npx blueprint run testCommission

# Проверка лотереи
npx blueprint run testLottery

# Мониторинг адреса комиссии
npx blueprint run monitorCommission
```

## 🔒 Безопасность

### Чек-лист перед продакшеном:
- [ ] **Аудит кода** - обязательно для mainnet
- [ ] **Тестирование в testnet** - минимум 1 неделя
- [ ] **Проверка адреса комиссии** - контроль приватных ключей
- [ ] **Мониторинг** - настройка алертов
- [ ] **Документация** - уведомление пользователей о комиссии
- [ ] **Резервное копирование** - ключи и конфигурация

### Рекомендации:
1. **Multisig кошелек** для адреса комиссии
2. **Постепенный запуск** - начать с малых сумм
3. **Мониторинг транзакций** - отслеживание аномалий
4. **План отката** - процедуры экстренного останова

## 📊 Мониторинг

### Ключевые метрики:
- Общий объем переводов
- Сумма собранных комиссий
- Количество выигрышей в лотерее
- Баланс адреса комиссии

### Инструменты:
- TON Explorer: https://tonscan.org
- TON API для автоматизации
- Grafana + Prometheus для дашбордов

## 🆘 Поддержка

### Полезные ссылки:
- [TON Documentation](https://ton.org/docs)
- [Blueprint Framework](https://github.com/ton-community/blueprint)
- [TON Community](https://t.me/ton_dev)

### Файлы проекта:
- `ft/jetton-wallet.fc` - основной контракт
- `lottery-test.ts` - тесты лотереи
- `commission-test.ts` - тесты комиссии
- `FINAL_IMPLEMENTATION.md` - техническая документация

---

**Статус**: ✅ Готов к деплою в testnet  
**Следующий шаг**: Настройка виртуальной среды 