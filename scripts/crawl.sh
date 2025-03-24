#!/bin/bash

# Inject environment variables from the .env file.
set -a
source .env
set +a

docker exec -it crawler bin/crawler crawl config/local.yml
