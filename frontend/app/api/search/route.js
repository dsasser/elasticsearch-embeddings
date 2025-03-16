import { NextResponse } from 'next/server';
import { Client } from '@elastic/elasticsearch';
import fs from 'fs';

export async function GET(request) {
  const query = request.nextUrl.searchParams.get('q');
  const client = new Client({
    node: process.env.ELASTICSEARCH_URL,
    auth: {
      apiKey: process.env.ES_API_KEY
    },
    tls: {
      ca: fs.readFileSync('/app/ca.crt'),
      rejectUnauthorized: false
    }
  })
  try {
    // 🔍 Query Elasticsearch for search results
    const { hits } = await client.search({
      index: 'va-gov-index', // Change to your actual Elasticsearch index
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['title^3', 'meta_description'] // Boost title field
          }
        }
      }
    });

    // Format results
    const results = hits.hits.map(hit => ({
      id: hit._id,
      title: hit._source.title,
      description: hit._source.meta_description
    }));
    return NextResponse.json(results);
  } catch (error) {
    console.error('Elasticsearch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
