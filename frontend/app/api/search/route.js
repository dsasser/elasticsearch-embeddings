import { NextResponse } from 'next/server';
import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import OpenAI from 'openai'

export async function GET(request) {
  const query = request.nextUrl.searchParams.get('q');
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
  const searchQuery = {
    index,
    body: {
      size: 10,
      query: {
        multi_match: {
          query,
          fields: ['title^3', 'meta_description', 'body^2']
        }
      },
      "_source": ["body", "title", "meta_description", "url"],
      "highlight": {
        "fields": {
          "body": {}
        }
      }
    }
  };

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
      highlight: hit.highlight.body
    }));
    // console.log(results);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Elasticsearch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
