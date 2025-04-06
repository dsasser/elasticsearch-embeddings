# Elasticsearch Embeddings for Hybrid Search

This project provides a hybrid semantic search solution by combining Elasticsearch keyword search with OpenAI-generated embeddings, resulting in more accurate and relevant search experiences, especially suited for large-scale websites.

---

## Features

- **Hybrid Search:** Combines traditional Elasticsearch keyword queries with semantic embeddings.
- **Scalable:** Optimized for indexing large volumes of website data.
- **Flexible Embedding Options:** Uses OpenAI by default, with easy alternatives.
- **Synthetic Data Generation:** Built-in tool for generating test data with semantic relationships.

---

## Technologies

- **Elasticsearch & Kibana:** Core search and data visualization services.
- **OpenAI Embeddings API:** Semantic embedding generation.
- **Open Web Crawler:** Web content ingestion.
- **Next.js:** User-facing search interface.
- **Synthetic Data Generator:** Python package for generating test data.

---

## Quickstart Guide

### 1. Prerequisites
- Docker (20.10+)
- Docker Compose (2.27+)
- [OpenAI API Key](https://platform.openai.com/api-keys) (minimal costs involved)
- Python 3.11+ (for synthetic data generation)

### 2. Set Up Environment Variables
Copy `env.example` to `.env` and provide required values:

| Variable               | Description                            | Example      |
|------------------------|----------------------------------------|--------------|
| `ELASTIC_PASSWORD`     | Elasticsearch admin password           | secure_pass! |
| `KIBANA_PASSWORD`      | Kibana system user password            | secure_pass! |
| `OPENAI_API_KEY`       | OpenAI API key                         | key_1234567  |
| `ES_MEM_LIMIT`         | Elasticsearch max memory               | 4000000000   |
| `ES_INDEX`             | Elasticsearch index name               | site-index   |
| `ES_URL`               | Elasticsearch URL                      | https://localhost:9200 |
| `ES_API_KEY`           | Elasticsearch API key                  | your_api_key |
| `ES_PIPELINE`          | Embeddings pipeline name               | openai_embeddings_pipeline |

### 3. Initialize the Elasticsearch Stack

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

### 5. Data Generation Options

#### Option 1: Synthetic Data (Recommended for Development)

The synthetic data generator creates controlled, semantically related documents perfect for testing and development. No external dependencies or permissions needed.

1. Set up Python environment:
```bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install the package
pip install -e .
```

2. Generate synthetic data:
```bash
# Generate 100 documents and save to data/synthetic_data.json
python scripts/generate-synthetic-data.py --num-documents 100

# Generate with a specific seed for reproducibility
python scripts/generate-synthetic-data.py --seed 42

# Generate without indexing to Elasticsearch
python scripts/generate-synthetic-data.py --no-index
```

Generated documents include:
```json
{
  "id": "doc1",
  "title": "Machine Learning in AI",
  "content": "Machine learning is a AI technique that focuses on feature engineering...",
  "category": "AI",
  "tags": ["machine learning", "feature engineering", "AI"],
  "type": "definition",
  "difficulty": "intermediate",
  "length": "short"
}
```

#### Option 2: Web Crawling (Advanced/Production Use)

⚠️ **Important Warning**: Web crawling should only be used with explicit permission from site owners. Unauthorized crawling may:
- Violate terms of service
- Overwhelm servers (potential DoS)
- Be illegal in some jurisdictions
- Result in IP bans

If you have permission to crawl a site:

1. Configure the crawler at `backend/crawler/config/private/crawler-config.yml`:

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

2. Generate an API key (recommended):
```bash
./scripts/create-crawler-key.sh
```

3. Run the crawler:
```bash
./scripts/start-crawler.sh
docker exec -it crawler bin/crawler crawl config/private/crawler-config.yml
```

### 6. Launch the Frontend

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
- [Crawler Configuration](./docs/CRAWLER.md)

---

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

[GNU General Public License v3.0](LICENSE)

