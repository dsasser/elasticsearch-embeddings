# Elasticsearch Embeddings for Hybrid Search and Recommendations

This project aims to build a hybrid search using Elasticsearch and machine learning embeddings. It focuses on enhancing search functionality by combining traditional keyword-based search with AI-powered semantic search. The goal is to create a more accurate and relevant search experience, particularly for large website indexes, by integrating embeddings into Elasticsearch.

## Key Features:
Hybrid search combining Elasticsearch's powerful keyword search with OpenAI embeddings for semantic understanding
Scalable and customizable to handle large datasets

## Technologies Used:
Elasticsearch
Kibana
OpenAI Embeddings API
Open Web Crawler
Next.js for the frontend

This project is intended to provide an open-source solution for a hybrid search leveraging AI embeddings, with potential applications in government websites, e-commerce, and content-heavy platforms.

## Quick Start Guide

### Prerequisites
- Docker (tested on 20.10.14)
- Docker Compose (tested on 2.27.1)
- An OpenAI [API Key](https://platform.openai.com/api-keys). This is used for embeddings during site crawling and when performing searches from the NextJS application. There are costs involved, but they are minimal for testing purposes. See the [EMBEDDINGS](./docs/EMBEDDINGS.md) doc for more info about how to use alternatives to OpenAI.

### 1) Setup Environment Variables
Copy the `env.example` from the project root and rename it `.env`.

At a minimum, set the `ELASTIC_PASSWORD`, `KIBANA_PASSWORD`, and `ENCRYPTION_KEY` variables. Elasticsearch and Kibana will not start without them.

### 2) Start the Elastic Stack
The first startup will start the 'setup', 'es01', and 'kibana' services from the `backend/elasticsearch/docker-compose.yml` configuration.

Run:
```sh
 `./scripts/start-elastic.sh --build`.
```

### 3) Copy Certificates to Host
Elasticsearch has security enabled, and only responds to HTTPS requests. Here we copy those certs to your host so that we can leverage them in clients like CURL.

```sh
./scripts/copy-certs.sh
```

This will copy Elasic and Kibana certs to the `./certs` directory.

### 4) Test Elasticsearh from the Terminal

```sh
./scripts/test-elastic.sh
```

If you get `curl: (60) SSL certificate problem: unable to get local issuer certificate` you didn't pass the correct SSL certificate. Check that you have a `./certs/es01/es01.crt` file and you are running the script from the project root.

If you get a json response with `missing authentication credentials for REST request`, the password was not correct. Check the ELASTIC_PASSWORD in your .env.

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

### 5) Create an Elasticsearch Index
This index has specific mappings for the Open Web Crawler and also adds a 'dense_vector' field named 'embeddings' where we will story the embedding vector data from the OpenAI Embeddings API.

**Make sure you have a ES_INDEX variable set in your .env.**

Run:
```sh
./scripts/create-index.sh
```

You should see a json reponse like this:
```json
{"acknowledged":true,"shards_acknowledged":true,"index":"site-index"}%
```

### 6) Create Elasticsearch API key For the Crawler
This is optional. You can continue to use the superuser account 'elastic' and the related ELASTIC_PASSWORD for the crawler, that will not fly in production, so you should create an Elasticsearc API key for the crawler and use that in your crawler config rather than the username/password pair.

```
./scripts/create-crawler-key.sh
```

This should provide a response that includes an 'encoded' key. Copy this to your your ES_API_KEY value in your .env file. You will also need to put it in your crawler config, since environment variables cannot be injected there.

### 7) Setup the Elasticsearch Inference Endpoint
This creates the inference endpoint which will perform the call to the OpenAI Embeddings API during document ingest using the 'text-embedding-ada-002' model. Read more about why I chose this model and other options you have in the embeddings [doc](./docs/EMBEDDINGS.md).

**This inference API will encure costs!**

```sh
./scripts/create-openai-inference-endpoint.sh
```

You should see this response:

```json
{"inference_id":"openai_embeddings","task_type":"text_embedding","service":"openai","service_settings":{"model_id":"text-embedding-ada-002","similarity":"dot_product","dimensions":1536,"rate_limit":{"requests_per_minute":3000}},"chunking_settings":{"strategy":"sentence","max_chunk_size":250,"sentence_overlap":1}}%
```

### 8) Setup the Embeddings Pipeline
Now we need to setup a new pipeline that will leverage the inference processor. The crawler will leverage this pipeline during document ingest.

```sh
./scripts/create-openai-embeddings-pipeline.sh
```

You should get this response:
```json
{"acknowledged":true}
```
