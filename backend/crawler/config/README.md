# Setup
The crawler needs several things in order to operate:
- Crawler configuration
- Elasticsearch API key
- Elasticsearch SSL fingerprint (if using SSL on Elasticsearch)
- Ingestion pipeline.
- Elasticsearch index

## Crawler Configuration
The crawler has example configurations in the [examples]('./crawler/config/examples) folder. More can be found in the [Open Web Crawler repo](https://github.com/elastic/crawler).

## Create an Elasticsearch API Key
Create an API key using the curl command below. Note is has more permissions than it needs, so only use this for local development. For production key permissions see the [Open Web Crawler](https://github.com/elastic/crawler) documentation.

``` sh
curl -k -X POST -u elastic:<your_password> https://localhost:9200/_security/api_key \
  -H 'Content-Type: application/json' -d '{
    "name": "crawler-api-key",
    "role_descriptors": {
      "crawler-role": {
        "cluster": ["all"],
        "index": [{"names":["*"],"privileges":["all"]}]
      }
    }
'
```

Copy the key and place it in your crawler config in the`elasticsearch` portion. eg:

```yaml
elasticsearch:
  host: https://es01
  port: 9200
  api_key: someAPIkey1234==
```

## Get Elasticsearch SSL Fingerprint
The fingerprint is necessary if you are using SSL on Elasticsearch. To get the fingerprint:

```sh
docker exec -it elasticsearch-es01-1 \
  openssl x509 -fingerprint -sha256 -noout \
  -in /usr/share/elasticsearch/config/certs/es01/es01.crt
```

It will return something like:
`SHA256 Fingerprint=AB:CD:EF:12:34:...`

Copy everything after the `=` sign and put it in your crawler config under the `elasticsearch` key. eg:

```yaml
elasticsearch:
  host: https://es01
  port: 9200
  api_key: somestringoftext==
  ca_fingerprint: AB:CD:EF:12:34:...
```

# Ingestion Pipeline
Create an ingestion pipeline.

```sh
curl -k -X PUT -u elastic:<your_password> \
  https://localhost:9200/_ingest/pipeline/ent-search-generic-ingestion \
  -H 'Content-Type: application/json' \
  -d '{
    "description": "Generic ingestion pipeline for the crawler",
    "processors": [
      {
        "set": {
          "field": "last_crawled_at",
          "value": "{{_ingest.timestamp}}"
        }
      }
    ]
  }'
```

# Define Index
You should define the index so it has the proper `last_crawled_at` date property:

```sh
curl -k -X PUT -u elastic:<your_password> https://localhost:9200/local-index \
-H 'Content-Type: application/json' \
-d '{
  "mappings": {
    "properties": {
      "last_crawled_at": {
        "type": "date"
      }
    }
  }
}'
```
# Running
To run the crawler, ensure it is running in docker, and execute the `crawl` command. You need to pass the config as the first argument. eg:

```sh
docker exec -it crawler bin/crawler crawl config/local.yml
```
