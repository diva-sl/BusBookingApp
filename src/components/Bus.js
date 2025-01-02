import React from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Bus({ bus }) {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        boxShadow: 2,
        borderRadius: 2,
        transition: "transform 0.3s ease-in-out",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            mb: 2,
            color: "#333",
            textTransform: "capitalize",
          }}
        >
          {bus.name}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              From
            </Typography>
            <Typography variant="body1">{bus.from}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              To
            </Typography>
            <Typography variant="body1">{bus.to}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Fare
            </Typography>
            <Typography variant="body1">$ {bus.fare} /-</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Journey Date
            </Typography>
            <Typography variant="body1">{bus.journeyDate}</Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{
              alignSelf: "center",
              mt: "auto",
              backgroundColor: "#00796b",
              "&:hover": {
                backgroundColor: "#004d40",
              },
            }}
            onClick={() => {
              navigate(`/book-now/${bus._id}`);
            }}
          >
            Book Now
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default Bus;
