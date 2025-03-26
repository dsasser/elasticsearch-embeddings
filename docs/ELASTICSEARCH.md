# Elasticsearch Configuration

This document explains the Elasticsearch setup for embedding-based search.

## Creating Elasticsearch Index
Your Elasticsearch index must include mappings for dense vector fields to store embeddings.

Use the provided script to create the index:
```bash
./scripts/create-index.sh
```

## Inference and Embeddings Pipeline
Create inference endpoints and pipelines for embedding generation:

```sh
./scripts/create-openai-inference-endpoint.sh
./scripts/create-openai-embeddings-pipeline.sh
```

## References
[Semantic search with Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-inference.html)
