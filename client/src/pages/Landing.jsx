import React from "react";
import Header from "../components/Header.jsx";
import SearchBar from "../components/SearchBar.jsx";
import "../styles/style.css";

function Landing() {
  return (
    <div className="container">
      <Header />
      <main className="landing-main">
        <div>
          <h1 className="landing-title">
            Build Your Word List Now
            <br />
            Practice it Later
          </h1>
          <p>
            Search for a word that you want to learn and save it to your list.
            <br />
            Access to your list any time and practice
          </p>
          <div className="search-bar-container">
            <h2 className="red">Start Now</h2>
            <SearchBar />
          </div>
        </div>

        <img
          className="landing-img"
          src="/landing-img3.jpg"
          alt="Landing Image"
        />
      </main>
    </div>
  );
}

export default Landing;
