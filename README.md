# Elasticsearch Embeddings for Hybrid Search

This project provides a hybrid semantic search solution by combining Elasticsearch keyword search with AI-generated embeddings, resulting in more accurate and relevant search experiences.

## Features

- **Hybrid Search:** Combines traditional Elasticsearch keyword queries with semantic embeddings.
- **Synthetic Data Generation:** Generate test data for development and testing.
- **Web Crawling (Optional):** Index real website content with proper permissions.
- **Flexible Embedding Options:** Uses OpenAI by default, with easy alternatives.

## Technologies

- **Elasticsearch & Kibana:** Core search and data visualization services.
- **OpenAI Embeddings API:** Semantic embedding generation.
- **Open Web Crawler:** Web content ingestion.
- **Next.js:** User-facing search interface.
- **Synthetic Data Generator:** Python package for generating test data.

## Quickstart Guide

### 1. Prerequisites
- Docker (20.10+)
- Docker Compose (2.27+)
- [OpenAI API Key](https://platform.openai.com/api-keys) (minimal costs involved)

### 2. Set Up Environment Variables
Copy `env.example` to `.env` and provide required values:

| Variable               | Description                            | Example      |
|------------------------|----------------------------------------|--------------|
| `ELASTIC_PASSWORD`     | Elasticsearch admin password           | secure_pass! |
| `KIBANA_PASSWORD`      | Kibana system user password            | secure_pass! |
| `OPENAI_API_KEY`       | OpenAI API key                         | key_1234567  |
| `ES_INDEX`             | Elasticsearch index name               | site-index   |
| `ES_PIPELINE`          | Embeddings pipeline name               | openai_embeddings_pipeline |

### 3. Initialize the Elasticsearch Stack

Run the setup script (creates Elasticsearch, Kibana, SSL certificates, and verifies connectivity):

```bash
./scripts/start-elastic.sh --build
./scripts/copy-certs.sh
./scripts/test-elastic.sh
```

Check Kibana at [http://localhost:5601](http://localhost:5601). Login with user `elastic` and your `ELASTIC_PASSWORD`.

### 4. Create Elasticsearch API Key.

This API KEY is used along with the CA certificate created during initial Elasticsearch setup in order to securely communicate with Elasticsearch APIs.

```bash
./scripts/create-es-api-key.sh
```

### 5. Set Up OpenAI Embeddings

1. Create the OpenAI inference endpoint:
```bash
./scripts/create-openai-inference-endpoint.sh
```

2. Create the embeddings pipeline:
```bash
./scripts/create-openai-embeddings-pipeline.sh
```

### 5. Generate and Index Synthetic Data

1. Install the package and dependencies:
```bash
python3.11 -m venv venv
source venv/bin/activate
pip install -e .
```

2. Generate and index synthetic data:
```bash
python scripts/generate-synthetic-data.py --num-documents 100
```

This will:
- Generate 100 synthetic documents about AI topics
- Save them to `data/synthetic_data.json`
- Index them into Elasticsearch with embeddings

### 6. Launch the Frontend

Start Next.js frontend:
```bash
./scripts/start-next.sh
```

Access your search UI at [http://localhost:3000](http://localhost:3000).

## Advanced: Web Crawling

For indexing real website content, see [CRAWLER.md](./docs/CRAWLER.md) for detailed instructions. Note that web crawling should only be used with proper permissions and consideration for the target website's resources.

## Architecture Overview

```
User -> Next.js Frontend -> Elasticsearch API
                             ^
                             |
                      Elasticsearch Index
                             ^
                             |
Synthetic Data Generator -> Elasticsearch Pipeline
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

