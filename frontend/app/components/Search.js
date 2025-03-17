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
  const [index, setIndex] = useState('va-gov-index');

  // Fetch results when the query or index changes.
  useEffect(() => {
    if (!query || !index) return;
  
    console.log(`Fetching results for query: ${query} on index: ${index}`);
  
    fetch(`/api/search?q=${query}&i=${index}`)
      .then(res => res.json())
      .then(data => {
        console.log("Search Results:", data); // Debug log
        setResults(data);
      })
      .catch(err => console.error("Fetch error:", err));
  }, [query, index]);

    // Update URL when a new search happens.
  const handleSearch = (newQuery, newIndex) => {
    setQuery(newQuery);
    setIndex(newIndex);
    // Construct the query string manually.
    const params = new URLSearchParams({ q: newQuery, i: newIndex});
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
