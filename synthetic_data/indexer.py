"""Elasticsearch indexer for synthetic data."""

import os
from typing import List, Dict
import json
from elasticsearch import Elasticsearch
from elasticsearch.helpers import bulk
from dotenv import load_dotenv
from urllib.parse import urlparse

class ElasticsearchIndexer:
    """Handles indexing of synthetic data into Elasticsearch."""
    
    def __init__(self):
        """Initialize the indexer with configuration from environment variables."""
        load_dotenv()
        
        self.es_url = os.getenv('ES_URL', 'http://localhost')
        self.es_port = os.getenv('ES_PORT', '9200')
        self.api_key = os.getenv('ES_API_KEY')
        self.index_name = os.getenv('ES_INDEX', 'site-index')
        self.pipeline_name = os.getenv('ES_PIPELINE', 'openai_embeddings_pipeline')
        self.cert_path = 'certs/ca.crt'
        
        if not self.api_key:
            raise ValueError("ES_API_KEY environment variable is required")
        
        # Configure client based on URL scheme
        parsed_url = urlparse(self.es_url)
        if parsed_url.scheme == 'https':
            self.client = Elasticsearch(
                f"{self.es_url}:{self.es_port}",
                api_key=self.api_key,
                ca_certs=self.cert_path,
                verify_certs=True
            )
        else:
            self.client = Elasticsearch(
                f"{self.es_url}:{self.es_port}",
                api_key=self.api_key,
                verify_certs=False
            )
    
    def _create_index_if_not_exists(self):
        """Create the index with proper mappings if it doesn't exist."""
        if not self.client.indices.exists(index=self.index_name):
            mappings = {
                "mappings": {
                    "properties": {
                        "id": { "type": "keyword" },
                        "title": { "type": "text" },
                        "content": { "type": "text" },
                        "category": { "type": "keyword" },
                        "tags": { "type": "keyword" },
                        "type": { "type": "keyword" },
                        "difficulty": { "type": "keyword" },
                        "length": { "type": "keyword" },
                        "embedding": {
                            "type": "dense_vector",
                            "dims": 1536,
                            "index": True,
                            "similarity": "dot_product"
                        }
                    }
                }
            }
            
            self.client.indices.create(
                index=self.index_name,
                body=mappings
            )
    
    def _generate_actions(self, documents: List[Dict]):
        """Generate bulk indexing actions."""
        for doc in documents:
            yield {
                "_index": self.index_name,
                "_id": doc["id"],
                "pipeline": self.pipeline_name,
                "_source": doc
            }
    
    def index_documents(self, documents: List[Dict]):
        """Index a list of documents into Elasticsearch."""
        try:
            # Create index if it doesn't exist
            self._create_index_if_not_exists()
            
            # Index documents using bulk API with pipeline
            success, failed = bulk(
                self.client,
                self._generate_actions(documents),
                raise_on_error=False
            )
            
            if failed:
                print(f"Failed to index {len(failed)} documents")
                for error in failed:
                    print(f"Error: {error}")
            
            print(f"Successfully indexed {success} documents")
            return success, failed
            
        except Exception as e:
            print(f"Error indexing documents: {str(e)}")
            raise
    
    def save_to_file(self, documents: List[Dict], filename: str = "synthetic_data.json"):
        """Save documents to a JSON file."""
        with open(filename, "w") as f:
            json.dump({"documents": documents}, f, indent=2)
        print(f"Saved {len(documents)} documents to {filename}")
