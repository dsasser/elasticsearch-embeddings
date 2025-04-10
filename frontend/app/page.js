import Search from './components/Search'

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr_auto] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col flex-grow min-h-screen gap-8 row-start-1">
          <div className="w-full max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center">Search with Elasticsearch Embeddings</h1>
            <Search />
          </div>
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center p-4 bg-gray-800 text-white">
        <p>
          <a href="https://github.com/dsasser/elasticsearch-embeddings">
            View the code on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
