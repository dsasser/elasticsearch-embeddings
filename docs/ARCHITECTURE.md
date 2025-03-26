
# Project Architecture Overview

This project implements a hybrid semantic search solution using Elasticsearch and embeddings.

## Architecture Diagram

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


## Components Overview

### Elasticsearch
- Stores structured data and embeddings.
- Manages search requests combining keyword and embedding queries.

### Open Web Crawler
- Crawls websites and ingests structured documents into Elasticsearch.
- Triggers embedding generation through Elasticsearch ingest pipelines.

### Embeddings (OpenAI)
- Provides semantic embedding vectors using `text-embedding-ada-002`.
- Integrated through Elasticsearch inference endpoints.

### Next.js Frontend
- User-friendly interface for performing searches.
- Sends search queries and renders results from Elasticsearch.

## Data Flow
1. **Ingestion**
   - Crawler fetches web content.
   - Elasticsearch ingest pipeline requests embeddings from OpenAI.
   - Documents enriched with embeddings are stored.

2. **Search**
   - Frontend submits queries.
   - Elasticsearch performs hybrid keyword and vector searches.
   - Results are returned and displayed by the frontend.
