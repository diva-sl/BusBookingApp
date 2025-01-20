import React from "react";
import { Box } from "@mui/material";
import BusIcon from "@mui/icons-material/DirectionsBus";

const Loader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <BusIcon
          sx={{
            fontSize: "50px",
            animation: "rotate 2s infinite linear",
            color: "#3a47d5",
          }}
        />
        <Box sx={{ marginTop: "20px", color: "#3a47d5", fontSize: "20px" }}>
          Loading...
        </Box>
      </Box>
      <style>
        {`
          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default Loader;
