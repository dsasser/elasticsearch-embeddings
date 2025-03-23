# Open Web Crawler for Elasticsearch
Open Crawler enables users to easily ingest web content into Elasticsearch

See https://github.com/elastic/crawler

# Setup

## Prerequisites
- An Elasticsearch API key with adequate permissions.
- The Elasticsearch certificate fingerprint
- The name of the Elasticsearch ingestion pipeline to use during ingest.

## Crawler Configuration
There is an [example](./../../backend/crawler/config/examples/crawler.yml.example) configuration in the [examples](./../../backend/crawler/config/examples/) folder which you should review. It contains all configuration options and descriptions of each. Have a look at the [simple.yml](./../../backend/crawler/config/examples/simple.yml) configuration example as well which contains only the necessary configurations to get a crawl going.

Create your own crawler configuration for the site you wish to crawl and place it in the `backend/crawler/config` directory.

**Important: The following configuration options need to match the values in your .env file.**

| Crawler key    | ENV variable |
| -------- | ------- |
| output_index | ES_INDEX |
| api_key | ES_API_KEY |


## Create an Elasticsearch API Key
Run the [create crawler key](../scripts/create-crawler-key.sh) script from the root of this project.

Copy the 'encoded' key and place it in your crawler config in the`elasticsearch` portion. eg:

```yaml
elasticsearch:
  host: https://es01
  port: 9200
  api_key: someAPIkey1234==
```

## Get Elasticsearch SSL Fingerprint
The crawler uses the certificate fingerprint for SSL. Use the below command to get the fingerprint from the Elasticsearch certificate.

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

# Running
First, run the docker service using docker compose:
`docker compose -f docker-compose.yml up`

Then start a crawl inside the docker container by executing the `crawl` command. You need to pass the path to the config as the second argument. eg:

```sh
docker exec -it crawler bin/crawler crawl config/local.yml
```
