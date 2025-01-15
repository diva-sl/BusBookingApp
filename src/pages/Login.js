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
      sx={{
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        animation: "backgroundAnimation 6s ease-in-out infinite",
        backgroundSize: "200% 200%",
      }}
      padding={2}
    >
      <Paper
        elevation={5}
        sx={{
          padding: 4,
          borderRadius: 2,
          width: "100%",
          maxWidth: 450,
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#003366",
            fontFamily: "Roboto, sans-serif",
          }}
        >
          Vought Bus - {signUp ? "Sign Up" : "Login"}
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
              sx={{
                marginBottom: 2,
                backgroundColor: "#f9f9f9",
                borderRadius: 1,
              }}
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
            sx={{
              marginBottom: 2,
              backgroundColor: "#f9f9f9",
              borderRadius: 1,
            }}
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
            sx={{
              marginBottom: 2,
              backgroundColor: "#f9f9f9",
              borderRadius: 1,
            }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            endIcon={<LoginIcon />}
            sx={{
              marginTop: 2,
              paddingY: 1.5,
              borderRadius: 2,
              backgroundColor: "#0066cc",
              "&:hover": {
                backgroundColor: "#005bb5",
              },
            }}
          >
            {signUp ? "Sign Up" : "Login"}
          </Button>
          <Button
            fullWidth
            color="secondary"
            onClick={handleClick}
            sx={{
              marginTop: 1,
              textTransform: "none",
              color: "#003366",
              fontWeight: "bold",
            }}
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
