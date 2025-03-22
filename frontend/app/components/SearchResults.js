"use client";

function highlightText(highlight) {
  return "<span class='text-gray-400'>...</span>" +highlight;
}

export default function SearchResults({results}) {  
  return (
    <div className="search-results-container w-full mx-auto max-w-xl mt-8 text-left">
      {results?.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="search-result p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-blue-400 mb-2"><a href={result.url} target="_blank" rel="noopener noreferrer">{result.title}</a></h3>
                <p className="results-highlight">
                  {result.highlight.map((highlight, index) => (
                    <span key={index} dangerouslySetInnerHTML={{ __html: highlightText(highlight) }} className="text--400"/>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No results found</p>
      )}
    </div>
  )
}
