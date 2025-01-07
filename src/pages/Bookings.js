import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useDispatch } from "react-redux";
import axios from "axios";
import { showLoading, hideLoading } from "../redux/AlertSlice";
import PageTitle from "../components/PageTitle";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  // Fetch bookings
  const getBookings = async () => {
    try {
      //   dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/bookings/get-bookings-by-user-id",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      //   dispatch(hideLoading());
      if (response.data.success) {
        setBookings(response.data.data);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      //   dispatch(hideLoading());
      console.error(error);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <PageTitle title="Bookings" />
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow sx={{ background: "rgb(101,101,101,.2)" }}>
              {[
                "Bus Name",
                "Bus Number",
                "Journey Date",
                "Journey Time",
                "Seats",
                "Action",
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
                <TableRow key={booking._id}>
                  <TableCell align="center">{booking.bus.name}</TableCell>
                  <TableCell align="center">{booking.bus.number}</TableCell>
                  <TableCell align="center">
                    {booking.bus.journeyDate}
                  </TableCell>
                  <TableCell align="center">{booking.bus.arrival}</TableCell>
                  <TableCell align="center">
                    {booking.seats.join(", ")}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => console.log("Print booking", booking._id)}
                      sx={{
                        color: "#6c757d",
                        "&:hover": { color: "#007bff" },
                      }}
                    >
                      <PrintIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No Bookings Available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Bookings;
