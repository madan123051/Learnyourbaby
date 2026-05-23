.PHONY: help install dev build preview clean docker-build docker-run docker-stop lint format

help:
	@echo "Sumi Sensei - Trilingual Learning App"
	@echo "======================================"
	@echo ""
	@echo "Available commands:"
	@echo "  make install      - Install dependencies"
	@echo "  make dev          - Start development server"
	@echo "  make build        - Build for production"
	@echo "  make preview      - Preview production build locally"
	@echo "  make clean        - Remove build artifacts"
	@echo "  make docker-build - Build Docker image"
	@echo "  make docker-run   - Run Docker container"
	@echo "  make docker-stop  - Stop Docker container"
	@echo "  make lint         - Run linting checks"
	@echo "  make format       - Format code"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

clean:
	rm -rf dist node_modules

docker-build:
	docker build -t sumi-sensei:latest .

docker-run:
	docker-compose up -d

docker-stop:
	docker-compose down

lint:
	npx eslint src --ext .ts,.tsx

format:
	npx prettier --write "**/*.{ts,tsx,json,md}"

.DEFAULT_GOAL := help
