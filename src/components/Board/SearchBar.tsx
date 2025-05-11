// src/components/Board/SearchBar.tsx
import { useState, useEffect } from "react";
import "../../styles/SearchBar.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(inputValue);
    }, 300); // 🔥 300ms debounce delay

    return () => clearTimeout(timeoutId); // 🔥 Cancel old timer if typing fast
  }, [inputValue, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value.trimStart(); // 🔥 Trim leading spaces
    setInputValue(newQuery);
  };

  return (
    <input
      type="text"
      className="search-bar"
      placeholder="Search..."
      value={inputValue}
      onChange={handleInputChange}
    />
  );
};

export default SearchBar;
