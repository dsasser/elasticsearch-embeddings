#!/bin/bash

set -x
docker compose --env-file .env -f backend/crawler/docker-compose.yml up "$@"
