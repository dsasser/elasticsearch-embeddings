export default function SearchButton({getResults}) {
    return (
      <div className="search-button">
        <button className="search-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit" onClick={getResults}>Search</button>
      </div>
    )
}
