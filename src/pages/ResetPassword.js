import React, { useState } from "react";
import { TextField, Typography, Button, Box, Paper } from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./global.css";

function ResetPassword() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    newPassword: "",
    reEnterPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    newPassword: "",
    reEnterPassword: "",
  });

  const validateFields = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      newPassword: "",
      reEnterPassword: "",
    };

    if (!inputs.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!inputs.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (inputs.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
      isValid = false;
    }

    if (inputs.newPassword !== inputs.reEnterPassword) {
      newErrors.reEnterPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const request = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/users/reset-password`,
        {
          email: inputs.email,
          password: inputs.newPassword,
        }
      );

      if (res.data.success) {
        alert("Password reset successful! Please login.");
        navigate("/login");
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
          Vought Bus - Reset Password
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
            label="New Password"
            margin="normal"
            name="newPassword"
            value={inputs.newPassword}
            onChange={handleChange}
            variant="outlined"
            type="password"
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            sx={{
              marginBottom: 2,
              backgroundColor: "#f9f9f9",
              borderRadius: 1,
            }}
          />
          <TextField
            fullWidth
            label="Re-enter Password"
            margin="normal"
            name="reEnterPassword"
            value={inputs.reEnterPassword}
            onChange={handleChange}
            variant="outlined"
            type="password"
            error={!!errors.reEnterPassword}
            helperText={errors.reEnterPassword}
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
            endIcon={<LockResetIcon />}
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
            Reset Password
          </Button>
        </form>

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
          Don't want reset? Login
        </Button>
      </Paper>
    </Box>
  );
}

export default ResetPassword;
