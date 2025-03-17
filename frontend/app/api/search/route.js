import { NextResponse } from 'next/server';
import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import OpenAI from 'openai'

export async function GET(request) {
  const query = request.nextUrl.searchParams.get('q');
  const index = request.nextUrl.searchParams.get('i');
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
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async function getOpenAIEmbedding(text) {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text
    });
    console.log('OpenAI Embedding Result: ', response.data[0].embedding);
    return response.data[0].embedding; // OpenAI returns an array, we need the first result
  }
  
  async function getOllamaEmbedding(text) {
    const response = await fetch("http://host.docker.internal:11434/api/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "mxbai-embed-large", prompt: text })
    });
    const data = await response.json();
    console.log('OpenAI Embedding Result: ', data.embedding);
    return data.embedding;
  }

  let searchQuery;

  if (index === 'va_documents_openai') {
    console.log(`Generating OpenAI embedding for: "${query}"`);
    const embedding = await getOpenAIEmbedding(query);
    
    searchQuery = {
      index: index,
      body: {
        size: 10,
        knn: {
          field: "embedding",
          query_vector: embedding,
          k: 10,
          num_candidates: 50,
        }
      }
    };
  } else if (index === 'va_documents_ollama') {
    console.log(`Generating Ollama embedding for: "${query}"`);
    const embedding = await getOllamaEmbedding(query);
    
    searchQuery = {
      index: index,
      body: {
        size: 10,
        knn: {
          field: "embedding",
          query_vector: embedding,
          k: 10,
          num_candidates: 50,
        }
      }
    };
  } else {
    console.log(`Performing keyword search on ${index}`);
    searchQuery = {
      index: index,
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['title^3', 'meta_description']
          }
        }
      }
    };
  }


  // const searchTypes = {
  //   'va-gov-index': {
  //     index: index,
  //     body: {
  //       query: {
  //         multi_match: {
  //           query: query,
  //           fields: ['title^3', 'meta_description']
  //         }
  //       }
  //     }
  //   },
  //   'va_documents_ollama': {
  //     index: index,
  //     body: {
  //       query: {
  //         multi_match: {
  //           query: query,
  //           fields: ['title^3', 'meta_description']
  //         }
  //       }
  //     }
  //   },
  //   'va_documents_openai': {
  //     index: index,
  //     body: {
  //       query: {
  //         multi_match: {
  //           query: query,
  //           fields: ['title^3', 'meta_description']
  //         }
  //       }
  //     }
  //   }
  // };
  try {
    // 🔍 Query Elasticsearch for search results
    const { hits } = await client.search(searchQuery);

    // Format results
    const results = hits.hits.map(hit => ({
      id: hit._id,
      title: hit._source.title,
      description: hit._source.meta_description
    }));
    console.log(results);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Elasticsearch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
