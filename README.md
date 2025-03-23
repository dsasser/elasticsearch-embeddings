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

We will spin up the entire stack in Docker using Docker Compose with this guide, including Elasticsearch, Kibana, Open Web Crawler, and NextJS.

### Setup Environment Variables
Copy the `env.example` from the project root and rename it `.env`.
