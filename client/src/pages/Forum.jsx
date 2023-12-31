import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Row from "../components/Forum-row.jsx";
import Header from "../components/Header.jsx";

function Forum() {
  const [threads, setThreads] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");
  
  useEffect(() => {
    fetch(`/api/threads`)
      .then((res) => res.json())
      .then((data) => setThreads(data))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleClick(event) {
    navigate("/forum/threads/new");
  }
  
  function filter(threads) {
    if (!searchQuery) {
      return threads;
    }
    return threads.filter((thread) =>
      thread.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  return (
    <div className="container">
      <Header />
      <main>
        <div className="feed-header">
          <h1 className="feed-header-header">Latest Discussions</h1>
          <button className="feed-header-btn btn " onClick={handleClick}>
            New Discussion
          </button>
        </div>
        <div>
          {filter(threads)?.map((thread) => {
            return (
              <Row
                key={thread._id}
                id={thread._id}
                title={thread.title}
                date={new Date(thread.date).toLocaleString()}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Forum;
