import React, { useState } from "react";
import {useNavigate } from "react-router-dom";

const GoogleSearch = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  

  function handleSubmit(e) {
    e.preventDefault();
    navigate(`/forum?search=${search}`);
  }

  return (
    <form className="search-form"onSubmit={handleSubmit}>
      <input
        type="text"      
        placeholder="Search on Forum.."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  );
};

export default GoogleSearch;
