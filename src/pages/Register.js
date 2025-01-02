import { TextField, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import React, { useEffect, useState } from "react";
import "./login.css";
import "./global.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signUp, setSignUp] = useState(true); // Initially set to SignUp mode

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const request = async (type, values) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/users/${type}`,
        values
      );
      const data = res.data;

      if (data.success) {
        if (type === "login") {
          localStorage.setItem("token", data.data);
          navigate("/");
        } else if (type === "register") {
          alert("Registration successful! Please login.");
          setSignUp(false);
        }
      }
    } catch (err) {
      console.log(err);
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
      request("register", inputs);
    } else {
      request("login", inputs);
    }
  };

  const handleToggleMode = () => {
    setSignUp(!signUp);
    if (!signUp) {
      navigate("/register");
    } else {
      navigate("/login");
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
          <Typography variant="h2">{signUp ? "Register" : "Login"}</Typography>
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
            value={inputs.password}
            margin="normal"
            name="password"
            type="password"
            onChange={handleChange}
          />
          <Button variant="contained" type="submit" endIcon={<VpnKeyIcon />}>
            {signUp ? "Sign Up" : "Login"}
          </Button>
          <Button onClick={handleToggleMode}>
            Change to {signUp ? "Login" : "SignUp"}
          </Button>
        </Box>
      </form>
    </div>
  );
}

export default Register;
