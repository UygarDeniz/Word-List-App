import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar(props) {
  const [searchWord, setSearchWord] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    navigate(`/wordlist/${searchWord}`);
  }

  return (
    <form className="search-form"onSubmit={handleSubmit}>
      <input
        type="text"
        className={props.classes}        
        placeholder="Search a word"
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
      />
    </form>
  );
}

export default SearchBar;
