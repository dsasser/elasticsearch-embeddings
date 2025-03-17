import os
import tiktoken
from elasticsearch import Elasticsearch
from dotenv import load_dotenv
from pathlib import Path
env_path = Path("/Users/danielsasser/projects/elasticsearch-embeddings/.env")  # Update this to your actual .env location
load_dotenv(dotenv_path=env_path)


# OpenAI Pricing
COST_PER_1K_TOKENS = 0.00002  # $0.00002 per 1,000 tokens

# Elasticsearch Configuration
ES_HOST = "https://localhost:9200"  # Adjust to your Elasticsearch IP
ES_INDEX = "va-gov-index"
ES_API_KEY = os.getenv("ES_API_KEY")
ES_CA_PATH = Path("/Users/danielsasser/projects/elasticsearch-embeddings/ca.crt")
ES = Elasticsearch(ES_HOST, ca_certs=ES_CA_PATH, api_key=ES_API_KEY)

# Load OpenAI tokenizer
tokenizer = tiktoken.get_encoding("cl100k_base")  # Uses OpenAI's tokenizer

def get_documents(batch_size=500):
    """Fetch all documents using Elasticsearch's scroll API."""
    query = {
        "size": batch_size,
        "query": {"match_all": {}}
    }

    # Initialize scrolling
    response = ES.search(index=ES_INDEX, body=query, scroll="2m")
    scroll_id = response["_scroll_id"]
    documents = response["hits"]["hits"]

    while len(response["hits"]["hits"]) > 0:
        # Retrieve next batch using scroll
        response = ES.scroll(scroll_id=scroll_id, scroll="2m")
        scroll_id = response["_scroll_id"]
        documents.extend(response["hits"]["hits"])

    return [(hit["_id"], hit["_source"]) for hit in documents]

def ensure_string(value):
    """Convert lists to strings, handle missing values."""
    if isinstance(value, list):
        return " ".join(value)  # Convert list to space-separated string
    return value if isinstance(value, str) else ""  # Ensure it's a string

def estimate_token_cost(document):
    """ Estimate the number of tokens and cost for a given document. """
    doc_text = "\n".join([
        ensure_string(document.get("title", "")),
        ensure_string(document.get("headings", "")),
        ensure_string(document.get("meta_description", "")),
        ensure_string(document.get("body", ""))
    ]).strip()
    tokens = len(tokenizer.encode(doc_text))
    cost = (tokens / 1000) * COST_PER_1K_TOKENS
    return tokens, cost

if __name__ == "__main__":
    total_tokens = 0
    total_cost = 0
    processed_docs = 0
    total_docs = ES.count(index=ES_INDEX)["count"]

    print(f"Estimating token usage for {total_docs} documents...")

    start_from = 0
    while start_from < total_docs:
        documents = get_documents()

        if not documents:
            break  # No more documents

        for doc_id, document in documents:
            tokens, cost = estimate_token_cost(document)
            total_tokens += tokens
            total_cost += cost
            processed_docs += 1

            print(f"Doc {doc_id}: {tokens} tokens, ${cost:.6f}")

        start_from += len(documents)  # Move to next batch

    print("\n=== Cost Estimation Summary ===")
    print(f"Total documents processed: {processed_docs}")
    print(f"Total tokens: {total_tokens}")
    print(f"Estimated total cost: ${total_cost:.2f}")
