export default function Searchbar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-row">
      <label className="search-field">
        <span className="search-icon" aria-hidden="true" />
        <input
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search"
          aria-label="Search tasks"
        />
      </label>
    </div>
  );
}
