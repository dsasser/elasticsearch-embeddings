Embeddings happen at ingest time if you are using the inference processor and pipeline described in [ELASTICSEARCH.md](./ELASTICSEARCH.md).

Semantic text embeddings leverage the OpenAI Embedding API by default, so an OpenAI API key is needed to leverage this setup. However, you can opt to use any of the available pre-trained models . See the [this guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/inference-apis.html) for more information.

## Alternatives to OpenAI Embeddings
