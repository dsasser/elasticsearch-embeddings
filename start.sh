#!/bin/bash


# Start Elasticsearch and friends.
echo "Starting Elasticsearch..."
docker-compose -f backend/elasticsearch/docker-compose.yml up -d

# Start the crawler.
echo "Starting crawler..."
docker-compose -f backend/crawler/docker-compose.yml up -d


# Start the frontend.
echo "Starting frontend..."
docker-compose -f frontend/docker-compose.yml up -d



