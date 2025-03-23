#!/bin/bash

# Inject environment variables from the .env file.
set -a
source .env
set +a

curl --cacert ./certs/es01/es01.crt \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -X PUT "https://localhost:${ES_PORT}/_ingest/pipeline/openai_embeddings_pipeline" \
  -H 'Content-Type: application/json' \
  -d '{
    "processors": [
      {
        "inference": {
          "model_id": "openai_embeddings", 
          "input_output": { 
            "input_field": "body",
            "output_field": "embedding"
          }
        }
      }
    ]
  }'