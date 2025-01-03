import React from "react";
import { Grid, Box, Typography, Paper } from "@mui/material";

function SeatSelection({ selectedSeats, setSelectedSeats, bus }) {
  const selectOrUnselectSeats = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  return (
    <Box p={2} sx={{ width: "50%", height: "300px" }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Seat Selection
      </Typography>
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          borderRadius: "8px",
          border: "1px solid #ddd",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Grid container spacing={2}>
          {Array.from(Array(bus.capacity).keys()).map((seat) => {
            const seatNumber = seat + 1;
            const isBooked = bus.seatsBooked.includes(seatNumber);
            const isSelected = selectedSeats.includes(seatNumber);

            return (
              <Grid item xs={3} key={seatNumber}>
                <Box
                  sx={{
                    width: "100%",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "6px",
                    backgroundColor: isBooked
                      ? "red"
                      : isSelected
                      ? "green"
                      : "lightgray",
                    color: isBooked ? "white" : "black",
                    cursor: isBooked ? "not-allowed" : "pointer",
                    border: isSelected ? "2px solid #4CAF50" : "1px solid #ccc",
                    boxShadow: isSelected
                      ? "0px 4px 6px rgba(0, 128, 0, 0.4)"
                      : "0px 1px 3px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: !isBooked
                        ? "0px 4px 8px rgba(0, 0, 0, 0.2)"
                        : "none",
                    },
                    fontSize: "14px",
                  }}
                  onClick={() => !isBooked && selectOrUnselectSeats(seatNumber)}
                >
                  {seatNumber}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  );
}

export default SeatSelection;
