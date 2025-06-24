import React, { useState } from "react";
import httpClient from "../httpClient";
import { useNavigate } from 'react-router-dom';
import "./loginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logInUser = async () => {
    console.log(email, password);

    try {
      const resp = await httpClient.post("/api/login", {
        email,
        password,
      });
      navigate("/home");
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Invalid credentials");
      }else{
        alert(error.message);
      }
    }
  };

  return (
  <div className="login-container">   
      <form className="form-group">
        <h1>Sign in</h1>
        <div className="form-field">
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={logInUser}>
          Submit
        </button>
        <a href="/register">Don't have an account? Sign up</a>
      </form>
  </div>
);

};

export default LoginPage;
