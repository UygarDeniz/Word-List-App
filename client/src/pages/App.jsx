import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactGA from "react-ga4";
import Landing from "./Landing.jsx";
import Test from "./Test.jsx";
import Wordlist from "./Wordlist.jsx";
import SignUp from "./SignUp.jsx";
import Login from "./Login.jsx";
import LogOut from "./LogOut.jsx";

import "../styles/style.css";


function App() {
  ReactGA.initialize("G-48QS564MT8", { debug: true });
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/test" element={<Test />} />
        <Route path="/wordlist" element={<Wordlist />} />
        <Route path="/wordlist/:word" element={<Wordlist />} />
        <Route path="/logout" element={<LogOut />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
