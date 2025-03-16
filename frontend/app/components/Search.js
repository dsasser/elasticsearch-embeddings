"use client";

import SearchInput from './SearchInput'
import SearchResults from './SearchResults'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get the query from URL (if available).
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
 
  // Fetch results when the query changes.
  useEffect(() => {
    if (query) {
      fetch(`/api/search?q=${query}`)
        .then(res => res.json())
        .then(data => setResults(data));
    }
  }, [query]);

    // Update URL when a new search happens.
  const handleSearch = (newQuery) => {
     // Prevent redundant updates.
    if (query === newQuery) return;
    setQuery(newQuery);
    // Construct the query string manually.
    const params = new URLSearchParams({ q: newQuery });
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="search-container">
      <SearchInput query={query} onSearch={handleSearch}/>
        {query && results.length > 0 && (
          <SearchResults results={results} />
        )}
    </div>
  )
}
