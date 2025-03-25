# Elasticsearch Embeddings for Hybrid Search and Recommendations

This project aims to build a hybrid search using Elasticsearch and machine learning embeddings. It focuses on enhancing search functionality by combining traditional keyword-based search with AI-powered semantic search. The goal is to create a more accurate and relevant search experience, particularly for large website indexes, by integrating embeddings into Elasticsearch.

## Key Features:
Hybrid search combining Elasticsearch's powerful keyword search with OpenAI embeddings for semantic understanding
Scalable and customizable to handle large datasets

## Technologies Used:
- Elasticsearch
- Kibana
- OpenAI Embeddings API
- Open Web Crawler
- Next.js

## Quickstart Guide

### Prerequisites
- Docker (tested on 20.10.14)
- Docker Compose (tested on 2.27.1)
- An OpenAI [API Key](https://platform.openai.com/api-keys). This is used for embeddings during site crawling and when performing searches from the NextJS application. There are costs involved, but they are minimal for testing purposes. See the [EMBEDDINGS](./docs/EMBEDDINGS.md) doc for more info about how to use alternatives to OpenAI.

### Setup Environment Variables
Copy the `env.example` from the project root and rename it `.env`.

Provide a value for every variable that is not commented out. You should also evaluate the memory variables like `KB_MEM_LIMIT` to ensure they will work in your environment. You can ignore the port variables unless you have a reason to change them.

### Start the Elastic Stack
Starting the Elastic stack for the first time

```sh
./scripts/start-elastic.sh --build
```

Once complete, you should be able to access Kibana by in at https://localhost:5601. Use username  'elastic' and the `ELASTIC_PASSWORD` from your .env.

### Copy Certificates to Host
Elasticsearch has TLS security enabled, and the initial setup created a self-signed certificate, which we need in order to use the the REST API. Run the below script to copy the certificates to your host system. The certificates will be copied to the `./certs` folder.

```sh
./scripts/copy-certs.sh
```

### Test Elasticsearh API
Tests that you can communicate with Elasticsearch using curl from the command line. This validates that the certificate and user credentials are correct.

```sh
./scripts/test-elastic.sh
```
You should receive a response like this:

```json
{
  "name" : "es01",
  "cluster_name" : "elasticsearch-embeddings",
  "cluster_uuid" : "YSXUXVACSvS4NFdqdkg9Mw",
  "version" : {
    "number" : "8.17.3",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "a091390de485bd4b127884f7e565c0cad59b10d2",
    "build_date" : "2025-02-28T10:07:26.089129809Z",
    "build_snapshot" : false,
    "lucene_version" : "9.12.0",
    "minimum_wire_compatibility_version" : "7.17.0",
    "minimum_index_compatibility_version" : "7.0.0"
  },
  "tagline" : "You Know, for Search"
}
```

### Create Elasticsearch Index
This index has specific mappings for the Open Web Crawler, which adds a 'dense_vector' field named 'embeddings' where we will store the embedding vector data from the OpenAI Embeddings API.

**Make sure you have the ES_INDEX variable set in your .env.**

```sh
./scripts/create-index.sh
```

You should see a json reponse like this:
```json
{"acknowledged":true,"shards_acknowledged":true,"index":"site-index"}%
```

### Create API Key for Crawler
The Open Web Crawler needs to be able to write to the index to create, delete, and update documents. Run this command to create the API key.

```sh
./scripts/create-crawler-key.sh
```

Copy the 'encoded' key to the `ES_API_KEY` value in your .env file.

### Setup the Elasticsearch Inference Endpoint
This creates the inference endpoint which will perform the call to the OpenAI Embeddings API during document ingest using the `text-embedding-ada-002` model from OpenAI. [doc](./docs/EMBEDDINGS.md).

**This inference API will encure costs!**

```sh
./scripts/create-openai-inference-endpoint.sh
```

You should see a response like this:

```json
{"inference_id":"openai_embeddings","task_type":"text_embedding","service":"openai","service_settings":{"model_id":"text-embedding-ada-002","similarity":"dot_product","dimensions":1536,"rate_limit":{"requests_per_minute":3000}},"chunking_settings":{"strategy":"sentence","max_chunk_size":250,"sentence_overlap":1}}%
```

### Setup the Embeddings Pipeline
Now we need to setup a new pipeline that will leverage the inference processor. The crawler will leverage this pipeline during document ingest.

```sh
./scripts/create-openai-embeddings-pipeline.sh
```

You should get this response:
```json
{"acknowledged":true}
```

## Open Web Crawler
Follow the setup instructions in the [Crawler](./docs/CRAWLER.md) readme. This will get it configured and indexing your content.

## Search Site
Spin up the NextJS application to build the search site:

```
./scripts/start-next.sh
```

Once complete you can visit the site at http://localhost:3000 and execute searches against your Elasticsearch instance using semantic queries!