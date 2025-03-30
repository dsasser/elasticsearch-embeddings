#!/bin/bash

# Start Elasticsearch and Kibana..
echo "Starting backend..."
docker-compose --env-file .env -f backend/elasticsearch/docker-compose.yml up -d --build

# Start the frontend.
echo "Starting frontend..."
docker-compose --env-file .env -f frontend/docker-compose.yml up -d --build
