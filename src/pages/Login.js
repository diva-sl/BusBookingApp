import { TextField, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signUp, setSignUp] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);
  const request = async (type) => {
    const res = await axios
      .post(`http://localhost:5000/user/${type}`, {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      })
      .catch((err) => console.log(err));
    const data = await res.data;
    if (!signUp && data.success) {
      localStorage.setItem("token", data.data);
      navigate("/");
    }
  };
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (signUp) {
      request("register").then((data) => console.log(data));
    } else {
      request("login");
    }
  };
  return (
    <div className="main3">
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          flexDirection={"column"}
          alignItems="center"
          className="Box"
          sx={{ width: { md: "40vw", sm: "80vw" } }}
        >
          <Typography variant="h2">{signUp ? "SignUp" : "Login"}</Typography>
          {signUp && (
            <TextField
              className="text"
              value={inputs.name}
              placeholder="name"
              margin="normal"
              name="name"
              onChange={handleChange}
            />
          )}
          <TextField
            className="text"
            placeholder="email"
            margin="normal"
            value={inputs.email}
            name="email"
            onChange={handleChange}
          />
          <TextField
            className="text"
            placeholder="password"
            value={inputs.password}
            margin="normal"
            name="password"
            onChange={handleChange}
          />
          {signUp ? (
            <Button variant="contained" type="submit">
              signUp
            </Button>
          ) : (
            <Button variant="contained" type="submit">
              Login
            </Button>
          )}
          <Button onClick={() => setSignUp(!signUp)}>
            Chaneg to {signUp ? "Login" : "SignUp"}
          </Button>
        </Box>
      </form>
    </div>
  );
}

export default Login;
