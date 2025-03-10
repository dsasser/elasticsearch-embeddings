export default function SearchInput({searchInput, setSearchInput}) {
    return (
      <div className="search-input">
        <label hidden={true} htmlFor="search">Search</label>
        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="mr-1 border-2 border-gray-300 rounded-md p-2" type="text" placeholder="Search" />
      </div>
    )
}
