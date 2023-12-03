import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import ForumSearch from "./ForumSearch";

function Header() {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const location = useLocation();
  useEffect(() => {
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

    return () => {
      window.removeEventListener("resize", () =>
        setWindowWidth(window.innerWidth)
      );
    };
  }, []);

  return (
    <header>
      <div className="header-container">
        {location.pathname.includes("forum") ? (
          <>
            <Link to="/" className="app-name-link red">
              WL Builder
              <br />
              Forum
              <br />
            </Link>
            <ForumSearch />
          </>
        ) : (
          <>
            <Link to="/" className="app-name-link red">
              Word List <br />
              Builder
            </Link>
            <SearchBar classes="search-bar-input header-search" />
          </>
        )}

        {windowWidth > 835 ? (
          <nav>
            <Link to="/wordlist" className="nav-link">
              Word List
            </Link>
            <Link to="/test" className="nav-link">
              Vocabulary Test
            </Link>
            <Link to="/forum" className="nav-link">
              Forum
            </Link>
            {localStorage.getItem("token") ? (
              <Link to="/logout" className="nav-link">
                Log Out
              </Link>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Log In
                </Link>
              </>
            )}
          </nav>
        ) : (
          <nav className="dropdown">
            <button className="dropbtn">Menu</button>
            <div className="dropdown-content dropdown-content-menu">
              <Link to="/wordlist" className="nav-link">
                Word List
              </Link>
              <Link to="/test" className="nav-link">
                Vocabulary Test
              </Link>
              <Link to="/forum" className="nav-link">
                Forum
              </Link>

              {localStorage.getItem("token") ? (
                <Link to="/logout" className="nav-link">
                  Log Out
                </Link>
              ) : (
                <>
                  <Link to="/login" className="nav-link">
                    Log In
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
