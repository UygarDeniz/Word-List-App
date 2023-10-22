import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";



function Wordlist() {
  const [text, setText] = useState({ word: "", text: "" });
  const [searchedWord, setSearchedWord] = useState({ searchedWord: "" });
  const [searchResults, setSearchResults] = useState([]);
  const [userList, setUserList] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.word) {
      fetch(`/api/search/${params.word}`)
        .then((res) => res.json())
        .then((data) => setText(data))
        .catch((error) => {
          console.log(error);
        });
    }
  }, [params.word]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetch("/api/wordlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: localStorage.getItem("token") }),
      })
        .then((res) => res.json())
        .then((data) => setUserList(data))
        .catch((error) => console.log("Error", error));
    }
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    if (localStorage.getItem("token")) {
      if (text.text !== "" || text.word !== "") {
        fetch(`/api/wordlist/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("token"),
            text: text.text,
            word: text.word,
          }),
        })
          .then((res) => res.json())
          .then((data) => setUserList(data))
          .catch((error) => console.log("Error", error));
      }
    } else {
      navigate("/login");
    }
  }
  function handleDelete(event) {
    event.preventDefault();
    const id = userList.find(listItem => listItem.word === event.target.previousSibling.innerText)._id 

    fetch(`/api/wordlist`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        word_id : id
      })
    })
      .then((res) => res.json())
      .then((data) => setUserList(data))
      .catch((error) => console.log("Error", error));        

  }
  function handleClick(event) {
    const foundWord = userList.find(
      (word) => word.word === event.target.innerText
    );
    setText({ word: foundWord.word, text: foundWord.definition });
    if (searchResults.length > 0) {
      setSearchResults([]);
    }
  }
  const handleChange = (e) => {
    setSearchedWord((prev) => ({ ...prev, searchedWord: e.target.value }));
    const results = userList.filter((userWord) =>
      userWord.word
        .toLowerCase()
        .includes(searchedWord.searchedWord.toLowerCase())
    );

    if (e.target.value === "") {
      setSearchResults([]);
    } else {
      setSearchResults(results);
    }
  };
  return (
    <div className="container">
      <Header />

      <main className="search-main">
        <aside className="word-list">
          {userList ? (
            <>
              <input
                type="text"
                placeholder="Search..."
                onChange={handleChange}
                value={searchedWord.searchedWord}
                name="search"
                autoComplete="off"
              />

              {searchResults.length > 0 && (
                <>
                  <div className="dropdown">
                    <div className="dropdown-content dropdown-content-list">
                      {searchResults.map((userWord) => (
                        <a onClick={handleClick} key={userWord.word}>
                          {userWord.word}
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {userList &&
                userList.map((userWord) => (
                  <div className="wordlist-row">
                    <h2
                      className="word-list-item"
                      onClick={handleClick}
                      key={userWord.word}
                    >
                      {userWord.word}
                    </h2>
                    <img className="wordlist-delete" onClick={handleDelete}
                    src="/trash-can.png"/>
                  </div>
                ))}
            </>
          ) : (
            <h2>Please login to save words</h2>
          )}
        </aside>

        <div className="definition-container">
          <form className="definition-form" onSubmit={handleSubmit}>
            <textarea
              className="definition-text"
              name="definition"
              maxLength={2000}
              value={text.text}
              onChange={(e) =>
                setText((prev) => ({ ...prev, text: e.target.value }))
              }
            />
            <Button text="Save" />
          </form>
        </div>
      </main>
    </div>
  );
}

export default Wordlist;
