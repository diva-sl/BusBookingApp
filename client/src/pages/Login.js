import React, { useEffect, useState } from "react";
import { TextField, Typography, Button, Box, Paper, Link } from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config";
import "./global.css";

function Login() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const validateFields = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    if (!inputs.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!inputs.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const request = async () => {
    try {
      const res = await axios.post(`${config.API_BASE_URL}/users/login`, {
        email: inputs.email,
        password: inputs.password,
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
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
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFields()) {
      request();
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
          Vought Bus - Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            variant="outlined"
            type="email"
            error={!!errors.email}
            helperText={errors.email}
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
            error={!!errors.password}
            helperText={errors.password}
            sx={{
              marginBottom: 1,
              backgroundColor: "#f9f9f9",
              borderRadius: 1,
            }}
          />
          <Box textAlign="right" mb={2}>
            <Link
              href="/password-reset"
              underline="hover"
              sx={{
                color: "#0066cc",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Forgot Password?
            </Link>
          </Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            endIcon={<VpnKeyIcon />}
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
            Login
          </Button>
        </form>

        <Button
          fullWidth
          color="secondary"
          onClick={() => navigate("/register")}
          sx={{
            marginTop: 1,
            textTransform: "none",
            color: "#003366",
            fontWeight: "bold",
          }}
        >
          Don't have an account? Register
        </Button>
      </Paper>
    </Box>
  );
}

export default Login;
