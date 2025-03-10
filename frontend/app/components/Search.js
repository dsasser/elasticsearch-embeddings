import SearchInput from './SearchInput'
import SearchButton from './SearchButton'
import SearchResults from './SearchResults'

export default function Search() {
    return (
        <div className="search-container">
          <div className="search-input-container flex flex-row items-start justify-left">
            <SearchInput />
            <SearchButton />
          </div>
          <div className="search-results-container flex flex-row items-start justify-left">
            <SearchResults />
          </div>
        </div>
    )
}
