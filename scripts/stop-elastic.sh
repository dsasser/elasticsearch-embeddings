#!/bin/bash

set -x
docker compose --env-file .env -f backend/elasticsearch/docker-compose.yml down "$@"