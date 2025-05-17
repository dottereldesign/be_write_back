// src/components/Board/SearchBar.tsx
import { useState, useEffect } from "react";
import "../../styles/SearchBar.css";
import { useDebounce } from "../../hooks/useDebounce"; // <-- correct

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState("");
  const debouncedValue = useDebounce(inputValue, 300); // <-- correct

  useEffect(() => {
    onSearch(debouncedValue.trim());
  }, [debouncedValue, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setInputValue(newQuery);
  };

  return (
    <input
      type="text"
      className="search-bar"
      placeholder="Search..."
      value={inputValue}
      onChange={handleInputChange}
      aria-label="Search pastes"
    />
  );
};

export default SearchBar;
