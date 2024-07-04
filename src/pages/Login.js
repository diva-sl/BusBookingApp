import { TextField, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

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
  }, [navigate]);

  const request = async (type) => {
    try {
      const res = await axios.post(`http://localhost:5000/user/${type}`, {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      });
      const data = res.data;
      if (data.success) {
        if (!signUp) {
          localStorage.setItem("token", data.data);
          navigate("/");
        }
      } else {
        console.error("Request failed");
      }
      return data;
    } catch (err) {
      console.error(err);
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
          flexDirection="column"
          alignItems="center"
          className="Box"
          sx={{ width: { md: "40vw", sm: "80vw" } }}
        >
          <Typography variant="h2">{signUp ? "Sign Up" : "Login"}</Typography>
          {signUp && (
            <TextField
              className="text"
              value={inputs.name}
              placeholder="Name"
              margin="normal"
              name="name"
              onChange={handleChange}
            />
          )}
          <TextField
            className="text"
            placeholder="Email"
            margin="normal"
            value={inputs.email}
            name="email"
            onChange={handleChange}
          />
          <TextField
            className="text"
            placeholder="Password"
            type="password"
            value={inputs.password}
            margin="normal"
            name="password"
            onChange={handleChange}
          />
          <Button variant="contained" type="submit">
            {signUp ? "Sign Up" : "Login"}
          </Button>
          <Button onClick={() => setSignUp(!signUp)}>
            Change to {signUp ? "Login" : "Sign Up"}
          </Button>
        </Box>
      </form>
    </div>
  );
}

export default Login;
