// src/components/Board/SearchBar.tsx
import { useState } from "react";
import "../../styles/SearchBar.css";

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery); // Pass the query to Board.tsx
  };

  return (
    <input
      type="text"
      className="search-bar"
      placeholder="Search..."
      value={query}
      onChange={handleInputChange}
    />
  );
};

export default SearchBar;
