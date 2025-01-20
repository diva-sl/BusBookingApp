import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchAllBookings = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/bookings/get-all-bookings",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.success) {
        setBookings(response.data.data);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px",
          backgroundColor: "rgb(101,101,101,0.1)",
          borderRadius: "10px",
          marginBottom: "20px",
          marginTop: "30px",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "darkblue" }}>
          Booking Management
        </Typography>
      </Box>
      <Box>
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <Table
            sx={{ minWidth: 650 }}
            size="small"
            aria-label="bookings table"
          >
            <TableHead>
              <TableRow
                sx={{ background: "rgb(101,101,101,.2)", height: "80px" }}
              >
                {[
                  "User Name",
                  "Bus Name",
                  "From",
                  "To",
                  "Journey Date",
                  "Seats",
                  "Total Fare",
                  "Status",
                ].map((header) => (
                  <TableCell
                    key={header}
                    align="center"
                    sx={{ fontWeight: "bold" }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <TableRow key={booking._id} sx={{ height: "60px" }}>
                    <TableCell align="center" sx={{ padding: "16px" }}>
                      {booking.user?.name || "Unknown"}
                    </TableCell>
                    <TableCell align="center">{booking.bus?.name}</TableCell>
                    <TableCell align="center">{booking.bus?.from}</TableCell>
                    <TableCell align="center">{booking.bus?.to}</TableCell>
                    <TableCell align="center">
                      {booking.bus?.journeyDate}
                    </TableCell>
                    <TableCell align="center">
                      {booking.seats?.join(", ")}
                    </TableCell>
                    <TableCell align="center">₹{booking.amount}</TableCell>
                    <TableCell align="center">
                      <Tooltip title={`Booking is ${booking.status}`} arrow>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: "bold",
                            color:
                              booking.status === "canceled"
                                ? "red"
                                : booking.status === "booked"
                                ? "green"
                                : "orange",
                          }}
                        >
                          {booking.status.toUpperCase()}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow sx={{ height: "60px" }}>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No bookings available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default AdminBookings;
