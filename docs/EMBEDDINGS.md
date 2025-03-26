# Embeddings Overview

Embeddings are dense numerical representations of text, capturing semantic meaning.

## Embedding Models
The default model used in this project is OpenAI's `text-embedding-ada-002`. This model produces embeddings with 1536 dimensions.

## Alternative Embedding Models
You can choose alternative models such as:
- Locally hosted models (e.g., Ollama)
- Other OpenAI embedding models

See the [Elasticsearch inference documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/inference-apis.html) for integration details.

## Costs
Using OpenAI embeddings incurs API costs. For experimentation, these costs are minimal, but consider local alternatives for heavy usage.
