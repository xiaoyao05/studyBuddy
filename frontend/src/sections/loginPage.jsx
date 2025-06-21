import React, { useState } from "react";
import httpClient from "../httpClient";
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h1>Log Into Your Account</h1>
      <form>
        <div>
          <label>Email: </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={() => logInUser()}>
          Submit
        </button>
        <br/>
        <a href="/register">
              Don't have an account? Sign up
        </a>
      </form>
    </div>
  );
};

export default LoginPage;
