import React from "react";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import "./global.css";

function Register() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          background: "aqua",
          width: { md: "40vw", sm: "80vw" },
          padding: "20px",
        }}
      >
        <form
          action="submit"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: { md: "30vw", sm: "80vw" },
            }}
          >
            <label htmlFor="Email">Name</label>
            <input type="text" placeholder="Name" className="input" />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: { md: "30vw", sm: "80vw" },
            }}
          >
            <label htmlFor="Email">Email</label>
            <input type="text" placeholder="Email" className="input" />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: { md: "30vw", sm: "80vw" },
            }}
          >
            <label htmlFor="Email">Password</label>
            <input type="text" placeholder="Password" className="input" />
          </Box>
          <Button variant="contained" sx={{ mt: "1vh" }}>
            Login
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default Register;
