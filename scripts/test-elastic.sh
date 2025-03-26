#!/bin/bash

set -a
source .env

curl --cacert ./certs/es01.crt \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -X GET "https://localhost:${ES_PORT}"

set +a