#!/bin/bash

# Start Elasticsearch and Kibana..
echo "Starting Elasticsearch..."
docker-compose --env-file .env -f backend/elasticsearch/docker-compose.yml up --build

# Start the crawler.
echo "Starting crawler..."
docker-compose --env-file .env -f backend/crawler/docker-compose.yml up --build

# Start the frontend.
echo "Starting frontend..."
docker-compose --env-file .env -f frontend/docker-compose.yml up --build
