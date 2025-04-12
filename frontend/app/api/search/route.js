import { NextResponse } from 'next/server';
import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import OpenAI from 'openai'

export async function GET(request) {
  const query = request.nextUrl.searchParams.get('q');
  const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
  const mode = request.nextUrl.searchParams.get('mode') || 'semantic';
  const PAGE_SIZE = 25; // Constant for results per page
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
      model: "text-embedding-3-small",
      input: text
    });
    return response.data[0].embedding;
  }

  // Base search query
  const searchQuery = {
    index,
    body: {
      size: PAGE_SIZE,
      from: (page - 1) * PAGE_SIZE,
      "_source": ["title", "content", "category", "type", "tags"],
      "highlight": {
        "fields": {
          "content": {},
          "title": {}
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
          fields: ['title^3', 'content^2', 'category', 'tags']
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
                fields: ['title^3', 'content^2', 'category', 'tags'],
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
      content: hit._source.content,
      category: hit._source.category,
      type: hit._source.type,
      tags: hit._source.tags,
      highlight: {
        content: hit?.highlight?.content || [],
        title: hit?.highlight?.title || []
      },
      _score: hit._score
    }));

    return NextResponse.json({
      total: hits.total?.value || 0,
      results,
      mode,
      pageSize: PAGE_SIZE
    });
  } catch (error) {
    console.error('Elasticsearch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
