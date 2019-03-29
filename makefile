#!make

.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## install dependencies, build dockerfiles & launch mongodb container
	npm install
	docker build -t coditor-php ./dockerfiles/php/
	docker build -t coditor-js ./dockerfiles/js/
	docker-compose up -d

run: ## run nodejs server
	npm run sass
	npm start

stop: ## stop mongodb container
	docker-compose down