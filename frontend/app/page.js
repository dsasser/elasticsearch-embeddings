export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start">
        <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="mb-4">Search with Elasticsearch Embeddings</h1>
          <label hidden={true} htmlFor="search">Search</label>
          <input className="mr-1 border-2 border-gray-300 rounded-md p-2" type="text" placeholder="Search" />
          <button className="bg-blue-500 text-white p-2 rounded-md">Search</button>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>
          <a href="https://github.com/jason-m-hicks/elasticsearch-embeddings">
            View the code on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
