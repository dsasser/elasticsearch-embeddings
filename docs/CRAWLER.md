# Setup

## Prerequisites
- Ensure the crawler configuration file is located in backend/crawler/config (or a subdirectory).
- An Elasticsearch API key with adequate permissions.
- The Elasticsearch SSL fingerprint
- An existing Elasticsearch ingestion pipeline name.

## Crawler Configuration
There is an [example](./../../backend/crawler/config/examples/crawler.yml.example) configuration in the [examples](./../../backend/crawler/config/examples/) folder which you should review. It contains all configuration options and descriptions of each. Have a look at the [simple.yml](./../../backend/crawler/config/examples/simple.yml) configuration example as well which contains only the necessary configurations to get a crawl going.

Create your own crawler configuration for the site you wish to crawl and place it in the `backend/crawler/config` directory.

**Important: The following configuration options need to match the values in your .env file.**

| Crawler key    | ENV variable |
| -------- | ------- |
| output_index | ES_INDEX |
| api_key | ES_API_KEY |


## Create an Elasticsearch API Key
Create an API key using the curl command below. Note is has more permissions than it needs, so only use this for local development. For production key permissions see the [Open Web Crawler](https://github.com/elastic/crawler) documentation.

``` sh
curl -X POST -u elastic:<your_password> --cacert=/path/to/elastic/ca.crt https://localhost:9200/_security/api_key \
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

# Ingest Pipeline
See [Elasticsearch README.md](../../elasticsearch/README.md)


# Define Index
See [Elasticsearch README.md](../../elasticsearch/README.md)

# Running
First, run the docker service using docker compose:
`docker compose -f docker-compose.yml up`

Then start a crawl inside the docker container by executing the `crawl` command. You need to pass the path to the config as the second argument. eg:

```sh
docker exec -it crawler bin/crawler crawl config/local.yml
```
