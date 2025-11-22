import React from "react";

function FilterBar({ categories, selectedCategory, onChange }) {
  return (
    <div className="filter-bar">
      <span className="filter-icon material-icons-outlined">filter_list</span>
      <select
        value={selectedCategory}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterBar;
