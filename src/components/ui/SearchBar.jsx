import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${query.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar Pokémon..."
        className="p-2 rounded-lg w-64 text-gray-800"
        minLength={1}
      />
      <button
        type="submit"
        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
      >
        <Search size={20} />
      </button>
    </form>
  );
};

export default SearchBar;
