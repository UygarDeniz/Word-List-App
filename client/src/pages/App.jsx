import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Landing.jsx";
import Wordlist from "./Wordlist.jsx";
import SignUp from "./SignUp.jsx";
import Login from "./Login.jsx";
import LogOut from "./LogOut.jsx";
import "../styles/style.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Landing />} />
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
