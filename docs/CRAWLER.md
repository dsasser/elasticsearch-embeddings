# Open Web Crawler Setup

The Open Web Crawler ingests content into Elasticsearch, leveraging embeddings during document ingestion.

## Prerequisites
- Docker and Docker Compose
- Elasticsearch running with SSL certificates
- OpenAI API key configured in `.env`

## Configuration

### 1. Generate API Key (Recommended)
For enhanced security, generate an Elasticsearch API key.:

```bash
./scripts/create-es-api-key.sh
```

Use the encoded key output in your crawler configuration.

### 2. Configure the Crawler
Create your crawler configuration at `backend/crawler/config/private/crawler-config.yml`:

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
  username: elastic
  password: <ELASTIC_PASSWORD>
  api_key: <api key>
  ca_fingerprint: <Fingerprint from certs/es01.crt>
  pipeline: openai_embeddings_pipeline
  pipeline_enabled: true
```

Replace:
- `<ELASTIC_PASSWORD>` with your Elasticsearch password
- `<api key>` with your generated API key
- `<Fingerprint>` with the certificate fingerprint from `certs/es01.crt`

## Running the Crawler

1. Start the crawler service:
```bash
./scripts/start-crawler.sh
```

2. Execute the crawler:
```bash
docker exec -it crawler bin/crawler crawl config/private/crawler-config.yml
```

## Important Notes
- Ensure you have permission to crawl the target website
- Be mindful of the website's robots.txt and rate limits
- Consider the impact on the target server's resources
- Start with a small `max_crawl_depth` and increase gradually

For more details, see the [Open Web Crawler](https://github.com/elastic/crawler) documentation.
