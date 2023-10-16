import React, { useState } from "react";
import Header from "../components/Header.jsx";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import "../styles/style.css";

function Login() {
  const [userData, setUserData] = useState({ userName: "", password: "" });
  const [message, setMessage] = useState();
  const navigate = useNavigate();
  function handleChange(event) {
    setUserData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.success){
          localStorage.setItem("token", data.token)
          navigate("/wordlist")
        } else {
          setMessage(data.err)
        }
      })
      .catch((error) => console.log("Error", error));
      
  }
  return (
    <div className="container">
      <Header />

      <main className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Login</h1>
          {message && <h3 className="red">{message}</h3>}
          <input
            type="text"
            placeholder="Username"
            name="userName"
            value={userData.userName}
            onChange={handleChange}
            required
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
          />
          <br />
          <Button text="Login" />
        </form>
          <h3>Don't have an account? <Link to="/signup">Sing Up</Link></h3>
      </main>
    </div>
  );
}

export default Login;
