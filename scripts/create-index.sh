#/bin/bash

# Inject environment variables from the .env file.
set -a
source .env
set +a

## Create index for Open Web Crawler.
curl -X PUT -u "elastic:${ELASTIC_PASSWORD}" --cacert ./certs/es01/es01.crt  "https://localhost:${ES_PORT}/${ES_INDEX}" \
  -H 'Content-Type: application/json' -d '{
    "mappings": {
      "properties": {
        "id": { "type": "keyword" },
        "body": { "type": "text" },
        "domains": { "type": "keyword" },
        "headings": { "type": "text" },
        "last_crawled_at": { "type": "date" },
        "links": { "type": "keyword" },
        "meta_description": { "type": "text" },
        "title": { "type": "text" },
        "url": { "type": "keyword" },
        "url_host": { "type": "keyword" },
        "url_path": { "type": "keyword" },
        "url_path_dir1": { "type": "keyword" },
        "url_path_dir2": { "type": "keyword" },
        "url_path_dir3": { "type": "keyword" },
        "url_port": { "type": "integer" },
        "url_scheme": { "type": "keyword" },
        "embedding": {
          "type": "dense_vector",
          "dims": 1536,
          "index": true,
          "similarity": "dot_product"
        }
      }
    }
  }'
