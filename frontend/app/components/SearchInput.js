'use client';

import { useState, useEffect } from "react";

export default function SearchInput({query, onSearch}) {
  const [input, setInput] = useState(query);

  useEffect(() => {
    setInput(query);
  }, [query]);

  const handleClick = (newIndex) => {
    if (!input.trim()) return;
    onSearch(input, newIndex);
  };

  return (
    <div className="search-input-container flex flex-row items-start justify-center">
      <div className="search-input">
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
          onClick={() => handleClick('va-gov-index')}
        >
          Search
        </button>
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          onClick={() => handleClick('va_documents_ollama')}
        >
          Search Ollama
        </button>
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          onClick={() => handleClick('va_documents_openai')}
        >
          Search OpenAI
        </button>
      </div>
    </div>
  )
}
