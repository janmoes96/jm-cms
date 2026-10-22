FROM docker.io/php:8.5-cli

WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libmcrypt-dev \
    default-mysql-client \
    libmagickwand-dev \
    libmagickcore-dev \
    libonig-dev \
    libzip-dev \
    unzip \
    git \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN pecl install imagick mcrypt \
    && docker-php-ext-enable imagick mcrypt \
    && docker-php-ext-install pdo_mysql

COPY docker/php/uploads.ini /usr/local/etc/php/conf.d/uploads.ini

# Install Composer
COPY --from=docker.io/library/composer:2 /usr/bin/composer /usr/local/bin/composer

# Copy dependency manifests first for build caching
COPY composer.json composer.lock ./
COPY package.json package-lock.json ./

# Copy application source (needed by Composer scripts)
COPY . .

# Install dependencies
RUN composer install --no-interaction --no-scripts
RUN composer run-script post-autoload-dump
RUN npm ci
