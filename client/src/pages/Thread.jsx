import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Comment from "../components/comment.jsx";
import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";

function Thread() {
  const params = useParams();
  const [threadData, setThreadData] = useState();
  const [reply, setReply] = useState({ content: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (localStorage.getItem("token")) {
      headers.append(
        "Authorization",
        `Bearer ${localStorage.getItem("token")}`
      );
    }
    fetch(`/api/threads/${params.id}`, {
      method: "GET",
      headers: headers,
    })
      .then((res) => res.json())
      .then((data) => {
        setThreadData(data);
      })
      .catch((error) => console.log("Error", error));
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    if (localStorage.getItem("token")) {
      fetch(`/api/threads/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          reply: reply.content,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setThreadData((prev) => ({ ...prev, thread: data.thread }));
          setReply({ content: "" });
        })
        .catch((error) => console.log("Error", error));
    } else {
      navigate("/login");
    }
  }
  function handleClick(event) {
    event.preventDefault();
    if (localStorage.getItem("token")) {
      fetch(`/api/threads/${params.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          navigate("/forum");
        })
        .catch((error) => console.log("Error", error));
    } else {
      navigate("/login");
    }
  }
  function handleCommentDelete(comment) {
    fetch(`/api/threads/${params.id}/comments/${comment._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setThreadData((prev) => {
        const updatedComments = prev.thread.comments.filter((c) => c._id !== comment._id)
        return {...prev, thread: {...prev.thread, comments: updatedComments}}
      })
        
      )
      .catch((error) => console.log("Error", error));
  }

  return (
    <div className="container">
      <Header />
      <main className="thread">
        {threadData && (
          <div>
            <div className="thread-header">
              <h1>{threadData.thread.title}</h1>
              {threadData.isOwner && (
                <img src="/trash-can.png" onClick={handleClick} />
              )}
            </div>
            <Comment
              postedBy={threadData.thread.postedBy.username}
              content={threadData.thread.content}
              date={new Date(threadData.thread.date).toLocaleString()}
            />

            {threadData.thread.comments.map((comment) => (
              <Comment
                key={comment._id}
                postedBy={comment.postedBy.username}
                content={comment.content}
                isAuthor={comment.isAuthor}
                deleteComment={() => handleCommentDelete(comment)}
                date={new Date(comment.date).toLocaleString()}
              />
            ))}
          </div>
        )}
        <div className="comments">
          <div className="reply">
            <form onSubmit={handleSubmit}>
              <textarea
                name="reply-content"
                className="reply-text"
                value={reply.content}
                onChange={(event) => setReply({ content: event.target.value })}
                maxLength={1000}
                rows="5"
              />
              <Button text="Reply" />
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Thread;
