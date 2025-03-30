"use client";

import Pagination from './Pagination';

function highlightText(highlight) {
  return "<span class='text-gray-400'>...</span>" + highlight;
}

function formatScore(score, mode) {
  if (mode === 'semantic') {
    // Semantic scores are 0-1, so cap and convert to percentage
    const cappedScore = Math.min(score, 1.0);
    return `${(cappedScore * 100).toFixed(1)}%`;
  } else if (mode === 'keyword') {
    // For keyword (BM25) scores, just show the raw score rounded to 2 decimals
    return score.toFixed(2);
  } else {
    // For hybrid, show raw score since it's a combination
    return score.toFixed(2);
  }
}

function ScoreDisplay({ score, mode }) {
  if (!score) return null;

  switch (mode) {
    case 'semantic':
      return (
        <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
          Semantic Match: {formatScore(score, mode)}
        </span>
      );
    case 'keyword':
      return (
        <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
          Relevance: {formatScore(score, mode)}
        </span>
      );
    case 'hybrid':
      return (
        <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
          Match Score: {formatScore(score, mode)}
        </span>
      );
    default:
      return null;
  }
}

export default function SearchResults({ results, query, page, setPage, searchMode }) {
  if (!query) return null;

  if (!results || !results.results || results.results.length === 0) {
    return (
      <p role="status" aria-live="polite" className="text-gray-500">
        No results found for &ldquo;{query}&rdquo;
      </p>
    );
  }
  
  const { results: items, total, pageSize } = results;

  return (
    <div 
      className="search-results-container w-full"
      role="region" 
      aria-label="Search results"
    >
      <h2 className="text-xl font-semibold mb-4">Search Results</h2>
      <p 
        className="text-sm text-gray-400 mb-4"
        role="status"
        aria-live="polite"
      >
        Found {total} results using {searchMode} search
      </p>
      <div 
        className="space-y-4"
        role="list"
        aria-label="Search results list"
      >
        {items.map((result, index) => (
          <article 
            key={result.url || index} 
            className="search-result p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            role="listitem"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-blue-400">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={`${result.title} (opens in new tab)`}
                >
                  {result.title}
                </a>
              </h3>
              {result._score && (
                <ScoreDisplay score={result._score} mode={searchMode} />
              )}
            </div>
            
            {/* Show either highlights or description */}
            {result.highlight?.length > 0 ? (
              <div 
                className="results-highlight"
                role="region"
                aria-label="Search result excerpt"
              >
                {result.highlight.map((highlight, index) => (
                  <span 
                    key={index} 
                    dangerouslySetInnerHTML={{ __html: highlightText(highlight) }} 
                    className="text-gray-400"
                  />
                ))}
              </div>
            ) : result.description ? (
              <p 
                className="text-sm text-gray-400 mt-1"
                role="region"
                aria-label="Result description"
              >
                {result.description}
              </p>
            ) : (
              <p 
                className="text-sm text-gray-500 mt-1 italic"
                aria-hidden="true"
              >
                No description available
              </p>
            )}
          </article>
        ))}
      </div>
      <Pagination total={total} page={page} setPage={setPage} pageSize={pageSize} />
    </div>
  );
}
