#!/bin/bash

# Stopping Elasticsearch and Kibana..
echo "Stopping backend..."
docker-compose --env-file .env -f backend/elasticsearch/docker-compose.yml down "$@"

# Stopping NextJS.
echo "Stopping frontend..."
docker-compose --env-file .env -f frontend/docker-compose.yml down "$@"
