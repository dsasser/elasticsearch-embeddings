#!/bin/bash

# Start Docker Compose services
echo "Starting Docker Compose services..."
docker-compose up --build -d

# Check if Docker Compose started successfully
if [ $? -ne 0 ]; then
  echo "Error: Failed to start Docker Compose services."
  exit 1
fi

echo "Docker Compose services are running."
