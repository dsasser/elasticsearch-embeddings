"use client";

import { useState } from "react";

export default function SearchResults({searchResults}) {

  return (
    <div className="search-results-container w-full mx-auto max-w-xl mt-8 text-left">
      {searchResults.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="space-y-4">
            {searchResults.map((result, index) => (
              <div key={index} className="search-result p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">{result.title}</h3>
                <p className="text-gray-400">{result.description}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No results found</p>
      )}
    </div>
    )
}
