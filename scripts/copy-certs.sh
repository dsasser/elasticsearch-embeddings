#!/bin/bash

set -a
source .env
set +a

docker cp "${COMPOSE_PROJECT_NAME}"-es01-1:/usr/share/elasticsearch/config/certs ./certs
