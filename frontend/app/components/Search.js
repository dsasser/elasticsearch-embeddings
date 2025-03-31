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
    semantic: "Natural language & conceptually related content",
    keyword: "Exact terms & specific phrases",
    hybrid: "Combined semantic & keyword search"
  };

  const exampleQueries = {
    semantic: "how to get started with installation",
    keyword: "Form 1010ez",
    hybrid: "create an account guide"
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col gap-2">
        <div className="w-full">
          <SearchInput query={query} onSearch={handleSearch}/>
        </div>
        
        {/* Search Mode Controls */}
        <div className="flex items-center gap-3 justify-start">
          <div className="flex items-center gap-2 bg-gray-800/50 px-2 py-1 rounded-lg border border-gray-700/50">
            <span className="text-xs text-gray-400">Mode:</span>
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
          
          <span className="text-xs text-gray-500">
            {modeDescriptions[searchMode]}
            <button 
              onClick={() => handleSearch(exampleQueries[searchMode])}
              className="ml-2 text-blue-400 hover:text-blue-300 hover:underline focus:outline-none"
            >
              Try an example →
            </button>
          </span>
        </div>
      </div>

      {/* Search Results or Loading State */}
      <div className="w-full">
        {isLoading ? (
          <div className="w-full flex flex-col justify-center items-center min-h-[200px] gap-3">
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
