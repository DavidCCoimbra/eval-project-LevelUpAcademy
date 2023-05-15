# Makefile

.PHONY: install start-api start-credit-card start-test

install:
	cd Api & npm install
	cd credit-card-validator-visual & npm install

start-api:
	cd Api & npm start 

start-client:
	cd credit-card-validator-visual & npm start

start-test:
	cd Api & npm test
