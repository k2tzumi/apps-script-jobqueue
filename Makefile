.DEFAULT_GOAL := help

CLASP = npx @google/clasp

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.clasp.json:
	make login
	$(CLASP) create --title JobBroker --type standalone --rootDir ./dist
	$(CLASP) setting fileExtension js
	rm -f .clasp.json-e

dist/index.js:
	make build

node_modules:
	npm install

.PHONY: login
login: ## Google login
login:
	$(CLASP) login

.PHONY: build
build: ## Build Google apps scripts
build: node_modules lint
	npm run build

.PHONY: push
push: ## Push Google apps scripts
push: .clasp.json dist/index.js
	$(CLASP) push -f

.PHONY: deploy
deploy: ## Deploy Google apps scripts
deploy: .clasp.json
	$(CLASP) deploy -d "`git log -1 --oneline | cut -b 9-`"

.PHONY: open
open: ## Open Google apps scripts
open: .clasp.json
	$(CLASP) open

.PHONY: pull
pull: ## Pull Google apps scripts
pull: .clasp.json
	$(CLASP) pull

.PHONY: lint
lint: ## Run tslint
lint: node_modules
	npm run lint

.PHONY: test
test: ## Run jest
test: node_modules
	npm test

.PHONY: clean
clean: ## clean webpack bundle
clean:
	rm -f dist/index.js*

.PHONY: undeploy
undeploy: ## all undeploy Google apps scripts
undeploy:
	$(CLASP) undeploy --all
