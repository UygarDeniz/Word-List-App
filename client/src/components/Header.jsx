import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import SearchBar from "./SearchBar";
import "../styles/style.css";
function Header() {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

    return () => {
      window.removeEventListener("resize", () => setWindowWidth(window.innerWidth));
    }
  }, []);
  
  
  
  
  return (
    <header>
      <div className="header-container">
        <Link to="/" className="app-name-link red">Word List <br/>Builder</Link>
        <SearchBar classes="search-bar-input header-search"/>
        
        
        {windowWidth > 835 ?
        <nav>
          <Link to="/wordlist" className="nav-link">Word List</Link>
          <span>|</span>
          <Link to="/test" className="nav-link">Vocabulary Test</Link>
          <span>|</span>
          {localStorage.getItem("token") ? <Link to="/logout" className="nav-link">Log Out</Link>
          : <>
            <Link to="/login" className="nav-link">Log In</Link> 
            </>
          }
        </nav>
        :
        <nav className="dropdown">
          <button className="dropbtn">Menu</button>
          <div className="dropdown-content">
            <Link to="/wordlist" className="nav-link">Word List</Link>
            <Link to="/test" className="nav-link">Vocabulary Test</Link>
            {localStorage.getItem("token") ? <Link to="/logout" className="nav-link">Log Out</Link>
            : <>
              <Link to="/login" className="nav-link">Log In</Link> 
              </>
            }
          </div>

          </nav>
        }
          
      </div>

    </header>
  );
}

export default Header;
