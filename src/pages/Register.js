import React, { useEffect, useState } from "react";
import { TextField, Typography, Button, Box, Paper } from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./global.css";

function Register() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const request = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/users/register`, {
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
    request();
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
        sx={{
          padding: 4,
          borderRadius: 2,
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Register
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
            endIcon={<VpnKeyIcon />}
            sx={{
              marginTop: 2,
              paddingY: 1.5,
              borderRadius: 2,
            }}
          >
            Register
          </Button>
          <Button
            fullWidth
            color="secondary"
            onClick={() => navigate("/login")}
            sx={{ marginTop: 1, textTransform: "none" }}
          >
            Already have an account? Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Register;
