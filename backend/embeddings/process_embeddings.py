import os
import openai
import ollama
from elasticsearch import Elasticsearch
from dotenv import load_dotenv
from pathlib import Path
import tiktoken
from elasticsearch.helpers import bulk

# Load API keys and Elasticsearch connection details
env_path = Path("/Users/danielsasser/projects/elasticsearch-embeddings/.env")  # Update this to your actual .env location
load_dotenv(dotenv_path=env_path)

# Load the tokenizer for OpenAI embeddings
tokenizer = tiktoken.encoding_for_model("text-embedding-3-small")

# Setup batch size.
BATCH_SIZE = 500  # Adjust as needed


# Setup Elasticsearch client.
ES_HOST = "https://localhost:9200"  # Adjust to your Elasticsearch IP
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ES_API_KEY = os.getenv("ES_API_KEY")
ES_CA_PATH = Path("/Users/danielsasser/projects/elasticsearch-embeddings/ca.crt")
ES = Elasticsearch(ES_HOST, ca_certs=ES_CA_PATH, api_key=ES_API_KEY)

def ensure_string(value):
    """Convert lists to strings, handle missing values."""
    if isinstance(value, list):
        return " ".join(value)  # Convert list to space-separated string
    return value if isinstance(value, str) else ""  # Ensure it's a string


def truncate_text(text, max_tokens=8192):
    """Truncate text to fit within OpenAI's token limit."""
    tokens = tokenizer.encode(text)
    if len(tokens) > max_tokens:
        print(f"⚠️ Truncating document from {len(tokens)} to {max_tokens} tokens.")
        tokens = tokens[:max_tokens]  # Keep only the first 8192 tokens
    return tokenizer.decode(tokens)  # Convert back to string

def generate_openai_embedding(text):
    """Generate embeddings using OpenAI API, truncating long inputs."""
    text = truncate_text(text, max_tokens=8192)  # Ensure it fits in context
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

def generate_ollama_embedding(text):
    """Generate embeddings locally using Ollama."""
    response = ollama.embeddings(model="mxbai-embed-large", prompt=text)
    return response["embedding"]

def process_documents():
    """Fetch documents, generate embeddings, and store them in batches using PIT + search_after."""
    total_indexed = 0

    # Start a Point-in-Time session (PIT) for consistent search state.
    pit_response = ES.open_point_in_time(index="va-gov-index", keep_alive="1m")
    pit_id = pit_response["id"]

    query = {
        "size": BATCH_SIZE,
        "query": {"match_all": {}},
        "sort": [{"last_crawled_at": "asc"}],  # Sorting is required for `search_after`
        "pit": {"id": pit_id, "keep_alive": "5m"}
    }

    search_after = None

    while True:
        if search_after:
            query["search_after"] = search_after  # Set `search_after` for deep pagination

        try:
            response = ES.search(body=query)
        except elasticsearch.NotFoundError:
            print("⚠️ PIT expired. Requesting a new PIT ID...")
            pit_response = ES.open_point_in_time(index="va-gov-index", keep_alive="5m")
            pit_id = pit_response.get("id")
            query["pit"]["id"] = pit_id  # Update the PIT ID
            response = ES.search(body=query)

        hits = response["hits"]["hits"]
        if not hits:
            break  # No more documents to process

        actions_openai = []
        actions_ollama = []

        for hit in hits:
            doc_id = hit["_id"]
            source = hit["_source"]
            doc_text = "\n".join([
                ensure_string(source.get("title", "")),
                ensure_string(source.get("headings", "")),
                ensure_string(source.get("meta_description", "")),
                ensure_string(source.get("body", ""))
            ]).strip()

            # Generate embeddings
            openai_embedding = generate_openai_embedding(doc_text)
            ollama_embedding = generate_ollama_embedding(doc_text)

            # Prepare OpenAI batch action
            actions_openai.append({
                "_op_type": "index",
                "_index": "va_documents_openai",
                "_id": doc_id,
                "_source": {
                    "title": source.get("title", ""),
                    "body": source.get("body", ""),
                    "headings": source.get("headings", ""),
                    "meta_description": source.get("meta_description", ""),
                    "embedding": openai_embedding
                }
            })

            # Prepare Ollama batch action
            actions_ollama.append({
                "_op_type": "index",
                "_index": "va_documents_ollama",
                "_id": doc_id,
                "_source": {
                    "title": source.get("title", ""),
                    "body": source.get("body", ""),
                    "headings": source.get("headings", ""),
                    "meta_description": source.get("meta_description", ""),
                    "embedding": ollama_embedding
                }
            })

        # Bulk index both sets of documents
        bulk(ES, actions_openai)
        bulk(ES, actions_ollama)
        total_indexed += len(hits)

        print(f"✅ Indexed {total_indexed} documents so far.")

        # Get the `search_after` value for the next batch
        search_after = hits[-1]["sort"]

    # Close the PIT session
    ES.close_point_in_time(body={"pit_id": pit_id})

    print(f"🎉 Finished indexing {total_indexed} documents!")


if __name__ == "__main__":
    process_documents()
    print("Embeddings stored in both indexes successfully!")