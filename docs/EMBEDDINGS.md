# Embeddings Overview

Embeddings are dense numerical representations of text, capturing semantic meaning. These numeric representations are created as vectors, and are stored (in the case of this project) in a [dense_vector](https://www.elastic.co/guide/en/elasticsearch/reference/current/dense-vector.html) field in Elasticsearch.

## Embedding Models
The default model used in this project is OpenAI's `text-embedding-ada-002`. This model produces embeddings with 1536 dimensions, which was a primary reason it was included as the default model.

## Alternative Embedding Models
You can choose alternative models such as:
- Locally hosted models (e.g., Ollama)
- [HuggingFace embedding models](https://www.elastic.co/guide/en/elasticsearch/reference/current/infer-service-hugging-face.html)
- Models from [Amazon Bedrock](https://www.elastic.co/guide/en/elasticsearch/reference/current/infer-service-amazon-bedrock.html)
- Other OpenAI embedding models
- And many more.

See the [Elasticsearch inference documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/inference-apis.html) for integration details.

## Costs
Using OpenAI embeddings incurs API costs. For experimentation, these costs are minimal, but consider local alternatives for heavy usage.
