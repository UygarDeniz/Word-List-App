import React from "react";

function Comment(props) {
  return (
    <article className="comment">
      <div className="comment-header">
        <h4>{props.postedBy}</h4>
        <p>{props.date}</p>
      </div>
      <hr />
      <p className="comment-content">{props.content}</p>
      {props.isAuthor && (
        <div className="comment-footer">
          <img src="/trash-can.png" onClick={props.deleteComment} />
        </div>
      )}
    </article>
  );
}

export default Comment;
