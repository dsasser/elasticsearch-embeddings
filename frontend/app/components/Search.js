"use client";

import SearchInput from './SearchInput'
import SearchButton from './SearchButton'
import SearchResults from './SearchResults'
import { useState } from 'react';

export default function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchClicked, setSearchClicked] = useState(false)
  
  const getResults = () => {
    setSearchResults([
      { title: "Result 1", description: "Description 1 that is longer than the others. It is a longer description that is longer than the others. It is a longer description that is longer than the others." },
      { title: "Result 2", description: "Description 2" },
      { title: "Result 3", description: "Description 3" }
    ]);
    setSearchClicked(true);
  }
  
    return (
      <div className="search-container">
        <div className="search-input-container flex flex-row items-start justify-center">
          <SearchInput searchInput={searchInput} setSearchInput={setSearchInput}/>
          <SearchButton getResults={getResults} />
        </div>
        <div className="search-results-container flex flex-row items-start justify-left">
          {searchClicked && searchResults.length > 0 && (
            <SearchResults searchResults={searchResults} />
          )}
        </div>
      </div>
    )
}
