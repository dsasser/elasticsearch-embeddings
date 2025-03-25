# Open Web Crawler for Elasticsearch
Open Crawler enables users to easily ingest web content into Elasticsearch

See https://github.com/elastic/crawler

# Setup

## Prerequisites
- An Elasticsearch API key with adequate permissions.
- The Elasticsearch certificate fingerprint
- The name of the Elasticsearch ingestion pipeline to use during ingest.

## Crawler Configuration
Copy the [embeddings-example.yml](./../backend/crawler/config/examples/elasticsearch.yml.example) configuration to the `backend/crawler/config/private` directory and rename it something meaningful for your project.

There are a lot of configuration options for both the crawler and elasticsearch. Review the [Open Web Crawler documentation](https://github.com/elastic/crawler) for more information on how to tweak your config beyond the example.

## Create an Elasticsearch API Key
To communicate with Elasticsearch, the crawler needs an API key. Create a key y running the below script

```sh
./scripts/create-crawler-key.sh
```
Copy the 'encoded' key and place it in your crawler config in the `elasticsearch` section. eg:

```yaml
elasticsearch:
  host: https://es01
  port: 9200
  api_key: someAPIkey1234== #API key goes here
```

## Get Elasticsearch SSL Fingerprint
The crawler uses the certificate fingerprint in API calls to Elasticsearch. Use the below command to get the fingerprint from the Elasticsearch SSL certificate.

```sh
openssl x509 -fingerprint -sha256 -noout -in certs/es01/es01.crt
```

It will return something like:
`SHA256 Fingerprint=AB:CD:EF:12:34:...`

Copy everything after the `=` sign and put it in your crawler config under the `elasticsearch` key. eg:

```yaml
elasticsearch:
  host: https://es01
  port: 9200
  api_key: someAPIkey1234==
  ca_fingerprint: AB:CD:EF:12:34:... # Fingerprint goes here
```

# Running
The crawler service runs in Docker. To start the service run this:

```sh
./scripts/start-crawler.sh
```

To crawl a site, execute the `crawl` command. The crawl runs from within the Docker container, so the path to your config is relative to its root directory. If you placed your config in the suggested folder, `backend/crawler/config/private`, your command would look like this (replacing the config name with your own).

```sh
docker exec -it crawler bin/crawler crawl config/private/your-config.yml
```
