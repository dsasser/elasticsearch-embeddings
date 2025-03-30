"use client";

import SearchInput from './SearchInput'
import SearchResults from './SearchResults'
import { useSearch } from '../hooks/useSearch';

export default function Search() {
  const {
    query,
    results,
    page,
    isLoading,
    searchMode,
    handleSearch,
    setPage,
    setSearchMode
  } = useSearch();

  const modeDescriptions = {
    semantic: "Best for natural language questions and finding conceptually related content, even when exact terms don't match",
    keyword: "Best for finding exact terms or phrases, like product names or specific terminology",
    hybrid: "Combines both approaches for a balance between exact matches and related content"
  };

  const exampleQueries = {
    semantic: "how to get started with installation",
    keyword: "ERROR_CODE_5001 troubleshooting",
    hybrid: "payment processing setup guide"
  };

  return (
    <div className="search-container max-w-3xl mx-auto">
      <div className="flex flex-col items-center gap-2">
        <SearchInput query={query} onSearch={handleSearch}/>
        
        {/* Search Mode Controls */}
        <div className="flex flex-col items-center gap-1.5 mt-2">
          <div className="flex items-center gap-2 bg-gray-800/50 p-1.5 rounded-lg border border-gray-700/50">
            <span className="text-xs text-gray-400 ml-1">Mode:</span>
            <select 
              value={searchMode}
              onChange={(e) => setSearchMode(e.target.value)}
              className="px-2 py-0.5 text-sm bg-transparent hover:bg-gray-700/50 rounded transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="semantic">Semantic</option>
              <option value="keyword">Keyword</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-xs text-gray-500 max-w-md text-center">
              {modeDescriptions[searchMode]}
            </p>
            <button 
              onClick={() => handleSearch(exampleQueries[searchMode])}
              className="px-3 py-1 text-xs bg-gray-800/70 text-gray-300 hover:bg-gray-700 rounded-full transition-all duration-150 hover:scale-[1.02] focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              Try: &ldquo;{exampleQueries[searchMode]}&rdquo;
            </button>
          </div>
        </div>
      </div>

      {/* Search Results or Loading State */}
      <div className="mt-8">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center min-h-[200px] gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-gray-300 border-t-blue-500"></div>
            <p className="text-sm text-gray-500">Searching...</p>
          </div>
        ) : (
          <SearchResults 
            results={results} 
            query={query} 
            page={page} 
            setPage={setPage}
            searchMode={searchMode}
          />
        )}
      </div>
    </div>
  )
}
