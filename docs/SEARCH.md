# Search Modes

This project provides three distinct search modes to help users find the most relevant content for their queries.

## Semantic Search

Semantic search uses AI embeddings to understand the meaning and context of your query, not just the exact words. This mode is best for:

- Natural language questions
- Finding conceptually related content
- Queries where exact terminology isn't known

**Example Queries:**
- "how to get started with installation"
- "best practices for secure configuration"
- "troubleshooting common problems"
- "what are the requirements for setup"
- "ways to improve system performance"
- "steps to migrate existing data"
- "recommended security measures"
- "common integration patterns"

This mode works well when users phrase queries as they would naturally speak or write, and when they're looking for content that might use different but related terminology.

## Keyword Search

Keyword search uses traditional text matching (BM25) to find exact matches for terms. This mode is best for:

- Specific error codes
- Product names or versions
- Technical terminology
- Exact phrase matching

**Example Queries:**
- "ERROR_CODE_5001 troubleshooting"
- "API endpoint documentation"
- "configuration settings reference"
- "version 2.1.0 release notes"
- "MaxConnectionsExceeded error"
- "HTTP status code 429"
- "docker-compose.yml example"
- "environment variables list"

This mode works well when users know exactly what they're looking for and want to find documents containing those specific terms.

## Hybrid Search

Hybrid search combines both semantic and keyword matching. This mode is best for:

- General-purpose searching
- Documentation browsing
- When you're not sure which mode would work better

**Example Queries:**
- "payment processing setup guide"
- "database migration steps"
- "authentication implementation example"
- "performance optimization tips"
- "deployment best practices"
- "monitoring system setup"
- "backup and recovery procedures"
- "scaling strategies guide"

This mode attempts to balance exact matches with conceptually related content, making it a good default choice for general searches.

## Technical Implementation

### Semantic Search
```json
{
  "knn": {
    "field": "embedding",
    "query_vector": "<generated-embedding>",
    "k": 10,
    "num_candidates": 100
  }
}
```
- Uses OpenAI's text-embedding-ada-002 model (1536 dimensions)
- Implements efficient KNN search using HNSW algorithm
- Cosine similarity for vector comparison
- Configurable k and num_candidates parameters

### Keyword Search
```json
{
  "multi_match": {
    "query": "<user-query>",
    "fields": ["title^3", "meta_description", "body^2"]
  }
}
```
- Uses Elasticsearch's BM25 scoring
- Field boosting for better relevance
- Automatic handling of stop words and stemming
- Language-aware text analysis

### Hybrid Search
```json
{
  "bool": {
    "should": [
      {
        "multi_match": {
          "query": "<user-query>",
          "fields": ["title^3", "meta_description", "body^2"],
          "boost": 0.3
        }
      },
      {
        "knn": {
          "field": "embedding",
          "query_vector": "<generated-embedding>",
          "k": 10,
          "num_candidates": 100,
          "boost": 0.7
        }
      }
    ]
  }
}
```
- Combines both approaches with configurable weights
- Default 30/70 split between keyword and semantic relevance
- Maintains good performance through efficient KNN implementation

## Customization Guide

### Adjusting Search Behavior

1. **Modify Field Weights**
   ```json
   "fields": ["title^4", "meta_description^2", "body^1"]
   ```
   - Increase title weight for more emphasis on titles
   - Adjust based on your content structure

2. **Tune KNN Parameters**
   ```json
   "knn": {
    "k": 20,                // Increase for more diverse results
    "num_candidates": 200   // Increase for better accuracy
   }
   ```

3. **Adjust Hybrid Weights**
   ```json
   "multi_match": { "boost": 0.4 },  // More keyword influence
   "knn": { "boost": 0.6 }           // Less semantic influence
   ```

### Content-Specific Optimization

1. **Technical Documentation**
   - Increase keyword weight
   - Add code-specific analyzers
   - Include file extensions in keyword search

2. **Knowledge Base**
   - Increase semantic weight
   - Add synonyms support
   - Enable fuzzy matching

3. **API Documentation**
   - Focus on exact matches
   - Boost endpoint paths
   - Include parameter names in keyword search

## Performance Considerations

1. **Vector Search**
   - HNSW index for fast KNN
   - Configurable trade-off between speed and accuracy
   - Memory usage scales with vector dimensions

2. **Keyword Search**
   - Standard inverted index
   - Minimal memory overhead
   - Very fast for exact matches

3. **Hybrid Search**
   - Slightly higher latency
   - More comprehensive results
   - Can be optimized based on usage patterns

## Monitoring and Optimization

1. **Search Quality**
   - Track click-through rates by mode
   - Monitor query patterns
   - Collect user feedback

2. **Performance Metrics**
   - Response times by mode
   - Cache hit rates
   - Resource utilization

3. **Continuous Improvement**
   - Adjust weights based on analytics
   - Update synonyms and stop words
   - Fine-tune based on user behavior 