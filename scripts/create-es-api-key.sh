#!/bin/bash

# Inject environment variables from the .env file.
set -a
source .env
set +a

# Create crawler API key
curl --cacert ./certs/es01.crt \
  -u "elastic:${ELASTIC_PASSWORD}" \
  -X POST "https://localhost:${ES_PORT}/_security/api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "embedding-api-key",
    "role_descriptors": { 
      "embedding-role": {
        "cluster": ["all"],
        "indices": [
          {
            "names": ["'"${ES_INDEX}"'"],
            "privileges": ["manage", "create", "index", "read", "write", "view_index_metadata"]
          }
        ]
      }
    },
    "metadata": {
      "application": "embedding"
    }
  }'

# Create superuser API key (optional)
create_superuser_key() {
  curl --cacert ./certs/es01/es01.crt \
    -u "elastic:${ELASTIC_PASSWORD}" \
    -X POST "https://localhost:${ES_PORT}/_security/api_key" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "superuser",
      "role_descriptors": {
        "superuser-role": {
          "cluster": ["all"],
          "indices": [
            {
              "names": ["*"],
              "privileges": ["all"]
            }
          ]
        }
      }
    }'
}

# Uncomment below if you want to create a superuser key
#create_superuser_key
