import React from "react";

function Row(props) {
  return (
    <div className="row">
      <div className="row-content">
        <a href={`/forum/threads/${props.id}`}>
          {props.title.length < 100
            ? props.title
            : props.title.slice(0, 100) + "..."}
        </a>
        <hr />
        <p>{props.date}</p>
      </div>
    </div>
  );
}

export default Row;
