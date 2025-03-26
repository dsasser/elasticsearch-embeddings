# Elasticsearch Configuration

This document explains the Elasticsearch setup for embedding-based search.

## Creating Elasticsearch Index
Your Elasticsearch index must include mappings for dense vector fields to store embeddings.

Use the provided script to create the index:
```bash
./scripts/create-index.sh
```

The document schema for the index created from this script is informed by the [Open Web Crawler schema](https://github.com/elastic/crawler/blob/main/docs/DOCUMENT_SCHEMA.md).

## Inference and Embeddings Pipeline
In this project, embeddings are created at ingest time by leveraging an [ingest pipeline](https://www.elastic.co/guide/en/elasticsearch/reference/current/ingest.html) configured to use an inference endpoint which calls the OpenAI Embeddings API. THe process pipeline is configured to store the response from the API in the 'embeddings' field of the document which is defined as a dense_vector field type.

Create inference endpoints and pipelines for embedding generation:

```sh
./scripts/create-openai-inference-endpoint.sh
./scripts/create-openai-embeddings-pipeline.sh
```

## References
[Semantic search with Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-inference.html)
