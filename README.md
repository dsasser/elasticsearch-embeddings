# Elasticsearch Embeddings for Hybrid Search

This project provides a hybrid semantic search solution by combining Elasticsearch keyword search with OpenAI-generated embeddings, resulting in more accurate and relevant search experiences, especially suited for large-scale websites.

---

## Features

- **Hybrid Search:** Combines traditional Elasticsearch keyword queries with semantic embeddings.
- **Scalable:** Optimized for indexing large volumes of website data.
- **Flexible Embedding Options:** Uses OpenAI by default, with easy alternatives.

---

## Technologies

- **Elasticsearch & Kibana:** Core search and data visualization services.
- **OpenAI Embeddings API:** Semantic embedding generation.
- **Open Web Crawler:** Web content ingestion.
- **Next.js:** User-facing search interface.

---

## Quickstart Guide

### 1. Prerequisites
- Docker (20.10+)
- Docker Compose (2.27+)
- [OpenAI API Key](https://platform.openai.com/api-keys) (minimal costs involved)

### 2. Setup Environment Variables
Copy `env.example` to `.env` and provide required values:

| Variable               | Description                            | Example      |
|------------------------|----------------------------------------|--------------|
| `ELASTIC_PASSWORD`     | Elasticsearch admin password           | secure_pass! |
| `KIBANA_PASSWORD`      | Kibana system user password            | secure_pass! |
| `OPENAI_API_KEY`       | OpenAI API key                         | key_1234567  |
| `ES_MEM_LIMIT`         | Elasticsearch max memory               | 4000000000   |
| `ES_INDEX`             | Elasticsearch index name               | site-index   |

### 3. Initialize Elasticsearch Stack

Run the setup script (creates Elasticsearch, Kibana, SSL certificates, and verifies connectivity):

```bash
./scripts/start-elastic.sh --build
./scripts/copy-certs.sh
./scripts/test-elastic.sh
```

Check Kibana at [http://localhost:5601](http://localhost:5601). Login with user `elastic` and your `ELASTIC_PASSWORD`.

### 4. Create Elasticsearch Resources
Set up index, inference endpoint, and embedding pipeline:

```bash
./scripts/create-index.sh
./scripts/create-openai-inference-endpoint.sh
./scripts/create-openai-embeddings-pipeline.sh
```

### 5. Web Crawling and Indexing

#### Configure Crawler

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

Replace `<ELASTIC_PASSWORD>` and `<Fingerprint>` with your actual credentials.

#### Using an API Key (Recommended)

It is recommended to use an Elasticsearch API key instead of username/password authentication for enhanced security. Generate an API key by running:

```bash
./scripts/create-crawler-key.sh
```

Use the encoded key output in your crawler configuration as shown above (api_key). Remove the username and password keys.

#### Run Crawler

```bash
./scripts/start-crawler.sh

docker exec -it crawler bin/crawler crawl config/private/crawler-config.yml
```

### 6. Launch Frontend

Start Next.js frontend:

```bash
./scripts/start-next.sh
```

Access your search UI at [http://localhost:3000](http://localhost:3000).

---

## Architecture Overview

```
User -> Next.js Frontend -> Elasticsearch API
                             ^
                             |
                      Elasticsearch Index
                             ^
                             |
Open Web Crawler -> Elasticsearch Pipeline
                        |
                        v
              OpenAI Embeddings API
```

**Detailed architecture** available in [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

---

## Further Reading

- [Elasticsearch Configuration](./docs/ELASTICSEARCH.md)
- [Embedding Models and Costs](./docs/EMBEDDINGS.md)
- [Crawler Detailed Configuration](./docs/CRAWLER.md)

---

## License

[GNU General Public License v3.0](LICENSE)

