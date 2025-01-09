import { TextField, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import LoginIcon from "@mui/icons-material/Login";
import React, { useEffect, useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
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
      const res = await axios.post(`http://localhost:5000/users/${type}`, {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      });
      if (res.data.success) {
        if (type === "login") {
          localStorage.setItem("token", res.data.data);
          navigate("/");
        } else if (type === "register") {
          navigate("/register");
        }
      } else {
        alert(res.data.message);
      }
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

  const handleClick = () => {
    setSignUp(!signUp);
    if (!signUp) {
      navigate("/register");
    } else {
      navigate("/login");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signUp) {
      request("register");
    } else {
      request("login");
    }
  };

  return (
    <div className="main3_div">
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
              value={inputs.name}
              className="text"
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
            margin="normal"
            value={inputs.password}
            name="password"
            onChange={handleChange}
          />
          <Button variant="contained" type="submit" endIcon={<LoginIcon />}>
            {signUp ? "SignUp" : "Login"}
          </Button>
          <Button onClick={handleClick} color="secondary">
            Change to {signUp ? "Login" : "SignUp"}
          </Button>
        </Box>
      </form>
    </div>
  );
}

export default Login;
