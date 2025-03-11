#!/bin/bash

# # Start Mutagen sync
# echo "Starting Mutagen sync..."
# mutagen sync start

# # Check if Mutagen sync started successfully
# if [ $? -ne 0 ]; then
#   echo "Error: Failed to start Mutagen sync."
#   exit 1
# fi

# Start Docker Compose services
echo "Starting Docker Compose services..."
docker-compose up --build -d

# Check if Docker Compose started successfully
if [ $? -ne 0 ]; then
  echo "Error: Failed to start Docker Compose services."
  exit 1
fi

echo "Starting Next.js development server..."
cd frontend
npm install
npm run build
npm run dev

# echo "Both Mutagen and Docker Compose services are running."
