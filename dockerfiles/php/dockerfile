from ubuntu:xenial
RUN apt-get update \
&& apt-get install -y curl \
&& apt-get install tree

RUN apt-get -y install php-cli php-curl php-gd php-intl php-json php-mbstring php-xml php-zip php-xdebug\
    && php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"\
    && php -r "if (hash_file('sha384', 'composer-setup.php') === '48e3236262b34d30969dca3c37281b3b4bbe3221bda826ac6a9a62d6444cdb0dcd0615698a5cbe587c3f0fe57a54d8f5') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"\
    && php composer-setup.php\
    && php -r "unlink('composer-setup.php');"\
    && mv composer.phar /usr/local/bin/composer

WORKDIR /app
COPY ./composer.json /app

RUN composer install \
   && composer require phpunit/phpunit