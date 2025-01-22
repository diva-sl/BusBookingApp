import React from "react";
import { Grid, Typography, Paper, Divider } from "@mui/material";
import { Living } from "@mui/icons-material";

function SeatSelection({ selectedSeats, setSelectedSeats, bus }) {
  const selectOrUnselectSeats = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const seatPairs = [];
  for (let i = 1; i <= bus.capacity; i += 2) {
    seatPairs.push([i, i + 1 <= bus.capacity ? i + 1 : null]); // Add pair only if within capacity
  }

  // Split seat pairs alternately into two columns
  const firstColumnPairs = seatPairs.filter((_, index) => index % 2 === 0);
  const secondColumnPairs = seatPairs.filter((_, index) => index % 2 !== 0);
  return (
    <Grid item xs={12} md={10} sx={{ ml: 5 }}>
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          borderRadius: "8px",
          border: "1px solid #ddd",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          width: "60%",
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom sx={{ mb: 3.5 }}>
          Seat Selection
        </Typography>
        <Divider sx={{ my: 2, borderColor: "rgba(0, 0, 0, 0.2)" }} />
        <Grid container sx={{ columnGap: 5 }}>
          {/* First Column */}
          <Grid item xs={5}>
            <Grid
              container
              direction="column"
              spacing={1}
              alignItems={"center"}
            >
              {firstColumnPairs.map((pair, index) => (
                <Grid container item spacing={1} key={index} width={"80%"}>
                  {pair.map(
                    (seatNumber) =>
                      seatNumber && (
                        <Grid item xs={6} key={seatNumber}>
                          <Living
                            sx={{
                              width: "100%",
                              height: "40px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "6px",
                              backgroundColor: bus.seatsBooked.includes(
                                seatNumber
                              )
                                ? "red"
                                : selectedSeats.includes(seatNumber)
                                ? "green"
                                : "#D3D3D3",
                              color: "white",
                              cursor: bus.seatsBooked.includes(seatNumber)
                                ? "not-allowed"
                                : "pointer",
                              border: selectedSeats.includes(seatNumber)
                                ? "2px solid #4CAF50"
                                : "1px solid #ccc",
                              boxShadow: selectedSeats.includes(seatNumber)
                                ? "0px 4px 6px rgba(0, 128, 0, 0.4)"
                                : "0px 1px 3px rgba(0, 0, 0, 0.1)",
                              transition: "all 0.2s ease",
                              "&:hover": !bus.seatsBooked.includes(
                                seatNumber
                              ) && {
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                              },
                              fontSize: "14px",
                            }}
                            onClick={() =>
                              !bus.seatsBooked.includes(seatNumber) &&
                              selectOrUnselectSeats(seatNumber)
                            }
                          >
                            {seatNumber}
                          </Living>
                        </Grid>
                      )
                  )}
                </Grid>
              ))}
            </Grid>
          </Grid>
          {/* Second Column */}
          <Grid item xs={5}>
            <Grid
              container
              direction="column"
              spacing={1}
              alignItems={"center"}
            >
              {secondColumnPairs.map((pair, index) => (
                <Grid container item spacing={1} key={index} width={"80%"}>
                  {pair.map(
                    (seatNumber) =>
                      seatNumber && (
                        <Grid item xs={6} key={seatNumber}>
                          <Living
                            sx={{
                              width: "100%",
                              height: "40px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "6px",
                              backgroundColor: bus.seatsBooked.includes(
                                seatNumber
                              )
                                ? "red"
                                : selectedSeats.includes(seatNumber)
                                ? "green"
                                : "#D3D3D3",
                              color: "white",
                              cursor: bus.seatsBooked.includes(seatNumber)
                                ? "not-allowed"
                                : "pointer",
                              border: selectedSeats.includes(seatNumber)
                                ? "2px solid #4CAF50"
                                : "1px solid #ccc",
                              boxShadow: selectedSeats.includes(seatNumber)
                                ? "0px 4px 6px rgba(0, 128, 0, 0.4)"
                                : "0px 1px 3px rgba(0, 0, 0, 0.1)",
                              transition: "all 0.2s ease",
                              "&:hover": !bus.seatsBooked.includes(
                                seatNumber
                              ) && {
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                              },
                              fontSize: "14px",
                            }}
                            onClick={() =>
                              !bus.seatsBooked.includes(seatNumber) &&
                              selectOrUnselectSeats(seatNumber)
                            }
                          >
                            {seatNumber}
                          </Living>
                        </Grid>
                      )
                  )}
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default SeatSelection;
