#!/bin/bash

set -x
docker compose --env-file .env -f frontend/docker-compose.yml up "$@"