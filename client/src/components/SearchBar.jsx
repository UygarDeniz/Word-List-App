import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
function SearchBar() {
  const [searchWord, setSearchWord] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    console.log(searchWord);
    navigate(`/wordlist/${searchWord}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-bar-input"
        placeholder="Search for a word"
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
      />
    </form>
  );
}

export default SearchBar;
