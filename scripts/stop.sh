#!/bin/bash

# Stopping Elasticsearch and Kibana..
echo "Stopping Elasticsearch..."
docker-compose --env-file .env -f backend/elasticsearch/docker-compose.yml down

# Stopping the crawler.
echo "Stopping crawler..."
docker-compose --env-file .env -f backend/crawler/docker-compose.yml down

# Stopping NextJS.
echo "Stopping NextJS..."
docker-compose --env-file .env -f frontend/docker-compose.yml down
