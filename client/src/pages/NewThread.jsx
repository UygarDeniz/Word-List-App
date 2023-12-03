import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";

function NewThread() {
  const navigate = useNavigate();
  const [threadData, setThreadData] = useState({ title: "", content: "" });

  function handleSubmit(e) {
    e.preventDefault();
    if (localStorage.getItem("token")) {
      fetch(`/api/threads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: threadData.title,
          content: threadData.content,
          token: localStorage.getItem("token"),
        }),
      })
        .then((res) => res.json())
        .then((data) => navigate(`/forum/threads/${data}`))
        .catch((error) => {
          console.log(error);
        });
    } else {
      navigate("/login");
    }
  }
  function handleChange(event) {
    setThreadData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  }

  return (
    <div className="container">
      <Header />
      <main className="new-thread">
        <h1>Start A Discussion</h1>
        <form onSubmit={handleSubmit}>
          <h2>Title</h2>
          <input
            className="newThread-title"
            type="text"
            name="title"
            value={threadData.title}
            onChange={handleChange}
            maxLength={100}
            minLength={5}
          />
          <h2>Content</h2>
          <textarea
            className="newThread-content"
            name="content"
            value={threadData.content}
            onChange={handleChange}
            maxLength={1840}
            minLength={10}
          />
          <Button text="Post" />
        </form>
      </main>
    </div>
  );
}

export default NewThread;
