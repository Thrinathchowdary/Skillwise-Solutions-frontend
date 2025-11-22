import React from "react";

function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <span className="search-icon material-icons-outlined">search</span>
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
