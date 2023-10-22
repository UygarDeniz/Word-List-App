import React, { useEffect } from "react";
import "../styles/style.css";

const GoogleSearch = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=a3ad329fb2d6141e1";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  return <div class="gcse-search"></div>
};

export default GoogleSearch;
