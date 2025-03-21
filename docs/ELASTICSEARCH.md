# Elasticsearch with OpenAI Embeddings and Open Web Crawler

The below assumes your elastic server is reachable at https://localhost:9200 and has SSL enabled.

Create your index with the below mappings if you are using the Open Web Crawler.
```sh
curl -X PUT -u elastic:<your_password> --cacert=/path/to/elastic/ca.crt https://localhost:9200/<your-index-name> \
  -H 'Content-Type: application/json' -d '{
    "mappings": {
      "properties": {
        "id": { "type": "keyword" },
        "body": { "type": "text" },
        "domains": { "type": "keyword" },
        "headings": { "type": "text" },
        "last_crawled_at": { "type": "date" },
        "links": { "type": "keyword" },
        "meta_description": { "type": "text" },
        "title": { "type": "text" },
        "url": { "type": "keyword" },
        "url_host": { "type": "keyword" },
        "url_path": { "type": "keyword" },
        "url_path_dir1": { "type": "keyword" },
        "url_path_dir2": { "type": "keyword" },
        "url_path_dir3": { "type": "keyword" },
        "url_port": { "type": "integer" },
        "url_scheme": { "type": "keyword" },
        "embedding": {
          "type": "dense_vector",
          "dims": 1536,
          "index": true,
          "similarity": "dot_product"
        }
      }
    }
  }'
```

Create an Inference processor to embed content using OpenAI API.

You will need an OpenAI API key for this to work.

```sh
curl -X PUT -u elastic:<your_password> --cacert=/path/to/elastic/ca.crt https://localhost:9200/_inference/text_embedding/openai_embeddings \
  -H 'Content-Type: application/json' -d '{
    "service": "openai",
    "service_settings": {
        "api_key": <open-ai-api-key>, 
        "model_id": "text-embedding-ada-002" 
    }
}'
```

```sh
curl -X PUT -u elastic:<your_password> --cacert=/path/to/elastic/ca.crt https://localhost:9200/<your-index-name> \
  -H 'Content-Type: application/json' -d '{
    "service": "openai",
    "service_settings": {
        "api_key": <open-ai-api-key>, 
        "model_id": "text-embedding-ada-002" 
    }
}'
```
```json
{
    "service": "openai",
    "service_settings": {
        "api_key": <open-ai-api-key>, 
        "model_id": "text-embedding-ada-002" 
    }
}
```

Create an ingest pipeline for the crawler to utilize while indexing:

```sh
curl -X PUT -u elastic:<your_password> --cacert=/path/to/elastic/ca.crt https://localhost:9200/_ingest/pipeline/openai_embeddings_pipeline \
  -H 'Content-Type: application/json' -d '{
  "processors": [
    {
      "inference": {
        "model_id": "openai_embeddings", 
        "input_output": { 
          "input_field": "body",
          "output_field": "embedding"
        }
      }
    }
  ]
}'
```

## References
- https://colab.research.google.com/github/elastic/elasticsearch-labs/blob/main/notebooks/search/07-inference.ipynb#scrollTo=f9101eb9
- https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-inference.html
