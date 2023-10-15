import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import "../styles/style.css";

function Wordlist() {
  const [text, setText] = useState({ word: "", text: "" });
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
        .then((data) => setUserList(data.userList))
        .catch((error) => console.log("Error", error));
    } else {
    }
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    if (localStorage.getItem("token")) {
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
    } else {
      navigate("/login");
    }
  }

  function handleClick(event) {
   
    const foundWord = userList.find(
      (word) => word.word === event.target.innerText
    );
    setText({ word: foundWord.word, text: foundWord.text });
  }
  return (
    <div className="container">
      <Header />

      <main className="search-main">
        <aside className="word-list">
          {userList ? (
            userList.map((userWord, index) => {
              return (
                <h2 className="word-list-item" onClick={handleClick} key={index}>
                  {userWord.word}
                </h2>
              );
            })
          ) : (
            <h2>Please login to save words</h2>
          )}
        </aside>

        <div className="definition-container">
          <form onSubmit={handleSubmit}>
            <textarea
              className="definition-text"
              name="definition"
              value={text.text}
              onChange={(e) =>
                setText((prev) => ({ ...prev, text: e.target.value }))
              }
              maxlenght={50}
            />
            <Button text="Save" />
          </form>
        </div>
      </main>
    </div>
  );
}

export default Wordlist;
