import React from "react";
import {Link} from "react-router-dom";
import SearchBar from "./SearchBar";
import "../styles/style.css";
function Header() {
  return (
    <header>
      <div className="header-container">
        <Link to="/" className="app-name-link red">Word List <br/>Builder</Link>
        <SearchBar />

        <nav>
          <Link to="/wordlist" className="nav-link">Word List</Link>
          <span>|</span>
          <Link to="/test" className="nav-link">Vocabulary Test</Link>
          <span>|</span>
          {localStorage.getItem("token") ? <Link to="/logout" className="nav-link">Log Out</Link>
          : <>

            <Link to="/login" className="nav-link">Log In</Link> 
            <span>|</span>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          
            </>
          }
        </nav>
      </div>
    </header>
  );
}

export default Header;
