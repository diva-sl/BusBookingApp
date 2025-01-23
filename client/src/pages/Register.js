import React, { useEffect, useState } from "react";
import { TextField, Typography, Button, Box, Paper } from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./global.css";
import config from "../config";

function Register() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
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
      name: "",
      email: "",
      password: "",
    };

    if (!inputs.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

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
      const res = await axios.post(`${config.API_BASE_URL}/users/register`, {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      });

      if (res.data.success) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Error during registration:", err);
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
          Vought Bus - Register
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            name="name"
            value={inputs.name}
            onChange={handleChange}
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name}
            sx={{
              marginBottom: 2,
              backgroundColor: "#f9f9f9",
              borderRadius: 1,
            }}
          />
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
            Register
          </Button>
          <Button
            fullWidth
            color="secondary"
            onClick={() => navigate("/login")}
            sx={{
              marginTop: 1,
              textTransform: "none",
              color: "#003366",
              fontWeight: "bold",
            }}
          >
            Already have an account? Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Register;
