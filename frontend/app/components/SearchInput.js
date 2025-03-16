'use client';

import { useState, useEffect } from "react";

export default function SearchInput({query, onSearch}) {
  const [input, setInput] = useState(query);

  useEffect(() => {
    setInput(query);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prevent empty searches.
    if (!input.trim()) return; 
    onSearch(input);
  };

  return (
    <div className="search-input-container flex flex-row items-start justify-center">
      <div className="search-input">
        <form onSubmit={handleSubmit}>
          <label hidden={true} htmlFor="search">Search</label>
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            className="mr-1 border-2 border-gray-300 rounded-md p-2" 
            type="text" 
            placeholder="Search" 
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  )
}
