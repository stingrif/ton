FROM ubuntu:22.04

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    clang \
    openssl \
    libssl-dev \
    zlib1g-dev \
    gperf \
    wget \
    git \
    curl \
    libreadline-dev \
    ccache \
    libmicrohttpd-dev \
    pkg-config \
    libsodium-dev \
    python3 \
    python3-pip \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Установка TON Development Tools
WORKDIR /ton
RUN git clone --recurse-submodules https://github.com/ton-blockchain/ton.git . \
    && mkdir build \
    && cd build \
    && cmake -DCMAKE_BUILD_TYPE=Release .. \
    && cmake --build . -j4

# Настройка переменных окружения
ENV PATH="/ton/build:$PATH"
ENV FIFTPATH="/ton/crypto/fift/lib"

# Установка Blueprint
RUN npm install -g @ton-community/blueprint

# Рабочая директория
WORKDIR /workspace

# Копирование проекта
COPY . /workspace/

# Установка зависимостей проекта
WORKDIR /workspace/token-contract
RUN npm install --legacy-peer-deps

# Команда по умолчанию
CMD ["bash"] 