"use client";

import { useState } from "react";

export default function SearchResults() {
  const [searchResults, setSearchResults] = useState([
    { title: "Result 1", description: "Description 1" },
    { title: "Result 2", description: "Description 2" },
    { title: "Result 3", description: "Description 3" }
  ]);
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Search Results</h2>
      <div className="space-y-4">
        {searchResults.map((result, index) => (
          <div key={index} className="p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">{result.title}</h3>
            <p className="text-gray-400">{result.description}</p>
          </div>
        ))}
      </div>
    </div>
    )
}
