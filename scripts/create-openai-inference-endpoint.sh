#!/bin/bash

# Inject environment variables from the .env file.
set -a
source .env
set +a

curl --cacert ./certs/es01.crt \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -X PUT "https://localhost:9200/_inference/text_embedding/openai_embeddings" \
  -H 'Content-Type: application/json' \
  -d '{
    "service": "openai",
    "service_settings": {
      "api_key": "'"${OPENAI_API_KEY}"'",
      "model_id": "text-embedding-3-small"
    }
  }
'
