export default function SearchInput() {
    return (
      <div className="search-input">
        <label hidden={true} htmlFor="search">Search</label>
        <input className="mr-1 border-2 border-gray-300 rounded-md p-2" type="text" placeholder="Search" />
      </div>
    )
}
