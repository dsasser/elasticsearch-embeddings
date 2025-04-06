#!/usr/bin/env python3

"""Generate and index synthetic data for embedding demonstrations."""

import argparse
from synthetic_data.generator import SyntheticDataGenerator
from synthetic_data.indexer import ElasticsearchIndexer

def main():
    parser = argparse.ArgumentParser(description="Generate and index synthetic data")
    parser.add_argument(
        "--num-documents",
        type=int,
        default=100,
        help="Number of documents to generate (default: 100)"
    )
    parser.add_argument(
        "--seed",
        type=int,
        help="Random seed for reproducible generation"
    )
    parser.add_argument(
        "--output-file",
        default="data/synthetic_data.json",
        help="Output file for generated data (default: data/synthetic_data.json)"
    )
    parser.add_argument(
        "--no-index",
        action="store_true",
        help="Skip indexing to Elasticsearch"
    )
    
    args = parser.parse_args()
    
    # Generate data
    generator = SyntheticDataGenerator(seed=args.seed)
    documents = generator.generate_dataset(args.num_documents)
    
    # Save to file
    indexer = ElasticsearchIndexer()
    indexer.save_to_file(documents, args.output_file)
    
    # Index to Elasticsearch if requested
    if not args.no_index:
        indexer.index_documents(documents)

if __name__ == "__main__":
    main() 