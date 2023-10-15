import React from "react";
import "../styles/style.css";

function Button(props) {
    return <button className="btn">{props.text}</button>
}

export default Button;