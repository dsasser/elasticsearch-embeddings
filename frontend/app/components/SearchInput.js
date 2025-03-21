'use client';

import { useState, useEffect } from "react";

export default function SearchInput({query, onSearch}) {
  const [input, setInput] = useState(query);

  useEffect(() => {
    setInput(query);
  }, [query]);

  const handleClick = () => {
    if (!input.trim()) return;
    onSearch(input);
  };

  return (
    <div className="search-input-container flex flex-row items-start justify-center">
      <div className="search-input">
        <label hidden={true} htmlFor="search">Search</label>
        <input 
          id="search"
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          className="mr-1 border-2 border-gray-300 rounded-md p-2" 
          type="text" 
          placeholder="Search" 
        />
        <label hidden={true} htmlFor="search-button">Search with Elastic full text search and OpenAI embeddings</label>
        <button 
          type="submit"
          id="search-button"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          onClick={handleClick}
        >
          Search
        </button>
      </div>
    </div>
  )
}
