import { NextResponse } from 'next/server';
import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import OpenAI from 'openai'

export async function GET(request) {
  const query = request.nextUrl.searchParams.get('q');
  const page = request.nextUrl.searchParams.get('page') || 1;
  const mode = request.nextUrl.searchParams.get('mode') || 'semantic';
  const index = process.env.ES_INDEX;
  const client = new Client({
    node: process.env.ELASTICSEARCH_URL,
    auth: {
      apiKey: process.env.ES_API_KEY
    },
    tls: {
      ca: fs.readFileSync('/app/certs/ca.crt'),
      rejectUnauthorized: false
    }
  })

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async function getOpenAIEmbedding(text) {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text
    });
    return response.data[0].embedding;
  }

  // Base search query
  const searchQuery = {
    index,
    body: {
      size: 10,
      from: (page - 1) * 10,
      "_source": ["body", "title", "meta_description", "url"],
      "highlight": {
        "fields": {
          "body": {}
        }
      }
    }
  };

  // Configure query based on search mode
  switch (mode) {
    case 'semantic':
      // Pure semantic search using KNN
      const embeddedSemantic = await getOpenAIEmbedding(query);
      searchQuery.body.query = {
        knn: {
          field: "embedding",
          query_vector: embeddedSemantic,
          k: 10,
          num_candidates: 100
        }
      };
      break;

    case 'keyword':
      // Pure keyword search using BM25
      searchQuery.body.query = {
        multi_match: {
          query,
          fields: ['title^3', 'meta_description', 'body^2']
        }
      };
      break;

    case 'hybrid':
      // Combined semantic and keyword search
      const embeddedHybrid = await getOpenAIEmbedding(query);
      searchQuery.body.query = {
        bool: {
          should: [
            {
              multi_match: {
                query,
                fields: ['title^3', 'meta_description', 'body^2'],
                boost: 0.3
              }
            },
            {
              knn: {
                field: "embedding",
                query_vector: embeddedHybrid,
                k: 10,
                num_candidates: 100,
                boost: 0.7
              }
            }
          ]
        }
      };
      break;
  }

  try {
    // 🔍 Query Elasticsearch for search results
    const { hits } = await client.search(searchQuery);

    // Format results
    const results = hits.hits.map(hit => ({
      id: hit._id,
      title: hit._source.title,
      description: hit._source.meta_description,
      url: hit._source.url,
      content: hit._source.body,
      highlight: hit?.highlight?.body || [],
      _score: hit._score // Include the score for display
    }));

    return NextResponse.json({
      total: hits.total?.value || 0,
      results,
      mode // Include the mode in the response
    });
  } catch (error) {
    console.error('Elasticsearch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
