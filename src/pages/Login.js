import React, { useEffect, useState } from "react";
import { TextField, Typography, Button, Box, Paper } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./global.css";

function Login() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({ email: "", password: "" });
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
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper
        elevation={3}
        sx={{ padding: 4, borderRadius: 2, width: "100%", maxWidth: 400 }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          {signUp ? "Sign Up" : "Login"}
        </Typography>
        <form onSubmit={handleSubmit}>
          {signUp && (
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              name="name"
              value={inputs.name}
              onChange={handleChange}
              variant="outlined"
            />
          )}
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            variant="outlined"
            type="email"
          />
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            name="password"
            value={inputs.password}
            onChange={handleChange}
            variant="outlined"
            type="password"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            endIcon={<LoginIcon />}
            sx={{ marginTop: 2, paddingY: 1.5, borderRadius: 2 }}
          >
            {signUp ? "Sign Up" : "Login"}
          </Button>
          <Button
            fullWidth
            color="secondary"
            onClick={handleClick}
            sx={{ marginTop: 1, textTransform: "none" }}
          >
            {signUp
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;
