# SyncFlow - CDC Platform v1.0
Real-time database sync using Change Data Capture.

# Tech Stack
PostgreSQL | Debezium | Kafka | Elasticsearch | FastAPI | React

# Architecture

PostgreSQL → Debezium → Kafka → Python Consumer → Elasticsearch → FastAPI → React

# Quick Start

## Start all services
docker-compose up -d

## Register Debezium connector
Invoke-RestMethod -Uri "http://localhost:8083/connectors" -Method Post -ContentType "application/json" -Body (Get-Content "connectors/postgres-connector.json" -Raw)

## Start React dashboard
cd frontend
npm install
npm start

# Access
Dashboard: http://localhost:3000
API Docs: http://localhost:8000/docs
Elasticsearch: http://localhost:9200

# Services
Service	        Port
PostgreSQL	    5432
Kafka	        9092
Kafka Connect	8083
Elasticsearch	9200
FastAPI	        8000
React	        3000

# Test CDC

## Insert a user
docker exec -it cdc-postgres psql -U postgres -d cdcdb -c "INSERT INTO users (email, name) VALUES ('test@test.com', 'Test User');"

## Check it appears in Elasticsearch
curl http://localhost:9200/users/_search