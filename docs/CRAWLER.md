# Open Web Crawler Setup

The Open Web Crawler ingests content into Elasticsearch, leveraging embeddings during document ingestion.

## Quick Configuration
Your crawler configuration (`crawler-config.yml`) minimally includes:

```yaml
domains:
  - url: https://example.com
    sitemap_urls:
      - https://example.com/sitemap.xml

output_sink: elasticsearch
output_index: site-index
max_crawl_depth: 2

elasticsearch:
  host: https://es01
  port: 9200
  api_key: <your_api_key>
  ca_fingerprint: <your_es_certificate_fingerprint>
  pipeline: openai_embeddings_pipeline
  pipeline_enabled: true
```

## Running the Crawler

```sh
./scripts/start-crawler.sh
```

Execute the command:

```sh
docker exec -it crawler bin/crawler crawl config/private/crawler-config.yml
```

More details are available in the [Open Web Crawler](https://github.com/elastic/crawler) documentation.

