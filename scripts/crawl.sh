#!/bin/bash

# Inject environment variables from the .env file.
set -a
source .env
set +a

echo "Crawling using configuration $@"
docker exec -it crawler bin/crawler crawl "$@"
