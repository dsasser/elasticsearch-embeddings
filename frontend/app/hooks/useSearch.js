import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from './useDebounce';

/**
 * A hook that manages search state and logic
 * @returns {Object} Search state and handlers
 */
export function useSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get initial values from URL
  const initialQuery = searchParams.get('q') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialMode = searchParams.get('mode') || 'hybrid';

  // State management
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState(initialMode);

  // Debounce the query
  const debouncedQuery = useDebounce(query, 300);

  // Search effect
  useEffect(() => {
    // Update URL
    const params = new URLSearchParams({ 
      q: debouncedQuery, 
      page: page,
      mode: searchMode 
    });
    router.push(`/?${params.toString()}`, { scroll: false });

    // Fetch results if we have a query
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${debouncedQuery}&page=${page}&mode=${searchMode}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, page, router, searchMode]);

  // Search handler
  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setPage(1); // Reset to first page on new search
  };

  return {
    query,
    results,
    page,
    isLoading,
    searchMode,
    handleSearch,
    setPage,
    setSearchMode
  };
} 