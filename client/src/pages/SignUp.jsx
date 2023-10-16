import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Button from "../components/Button.jsx";
function SignUp() {
  const [userData, setUserData] = useState({ userName: "", password: "" });
  const [message, setMessage] = useState("")
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
    fetch(`/api/signup`, {
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
          navigate("/")
        } else {
          setMessage(data.message)
        }
      })
      .catch((error) => console.log("Error", error));
  }
  return (
    <div className="container">
      <Header />

      <main className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          {message && <h2 className="red">{message}</h2>}
          <input
            type="text"
            placeholder="Username"
            name="userName"
            value={userData.userName}
            onChange={handleChange}
            minLength={3}
            maxLength={20}
            required
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            minLength={3}
            maxLength={20}
            required
          />
          <br />
          <Button text="Sign Up">Sign Up</Button>
        </form>
      </main>
    </div>
  );
}

export default SignUp;
