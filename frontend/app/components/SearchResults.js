"use client";

function highlightText(highlight) {
  return "<span class='text-gray-400'>...</span>" +highlight;
}

export default function SearchResults({ results, query }) {
  if (!query) return null;

  if (!results || !results.results || results.results.length === 0) {
    return <p>No results found</p>;
  }
  const { results: items, total } = results;

  return (
    <div className="search-results-container w-full mx-auto max-w-2xl mt-8 text-left">
      <h2 className="text-xl font-semibold mb-4">Search Results</h2>
      <p className="text-sm text-gray-400 mb-4">Found {total} results</p>
      <div className="space-y-4">
        {items.map((result, index) => (
          <div key={index} className="search-result p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              <a href={result.url} target="_blank" rel="noopener noreferrer">{result.title}</a>
            </h3>
            {<p className="results-highlight">
              {result.highlight.map((highlight, index) => (
                <span key={index} dangerouslySetInnerHTML={{ __html: highlightText(highlight) }} className="text-gray-400"/>
              ))}
            </p>}
          </div>
        ))}
      </div>
    </div>
  );
}
