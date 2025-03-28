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
  const initialPage = searchParams.get('page') || 1;

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(initialPage);

  // Fetch results when the query or index changes.
  useEffect(() => {
    if (!query) return;
    
    fetch(`/api/search?q=${query}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
      })
      .catch(err => console.error("Fetch error:", err));
  }, [query, page]);

    // Update URL when a new search happens.
  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    // Construct the query string manually.
    const params = new URLSearchParams({ q: newQuery, page: page });
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="search-container">
      <SearchInput query={query} onSearch={handleSearch}/>
      <SearchResults results={results} query={query} page={page} setPage={setPage} />
    </div>
  )
}
