import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Button, Typography, Grid, Divider, Paper } from "@mui/material";
import StripeCheckout from "react-stripe-checkout";
import { showLoading, hideLoading } from "../redux/AlertSlice";
import SeatSelection from "../components/SeatSelection";

function BookNow() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);

  const getBus = async () => {
    try {
      // dispatch(showLoading());
      const response = await axios.post(
        `http://localhost:5000/buses/get-bus-by-id`,
        { _id: params.id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // dispatch(hideLoading());
      if (response.data.success) {
        setBus(response.data.data);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      // dispatch(hideLoading());
      alert(error.message);
    }
  };

  const bookNow = async (transactionId, seats) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `http://localhost:5000/api/bookings/book-seat`,
        {
          bus: bus._id,
          seats,
          transactionId,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        alert(response.data.message);
        // navigate("/booking");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      alert(error.message);
    }
  };

  const onToken = async (token) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `http://localhost:5000/api/bookings/make-payment`,
        { token, amount: selectedSeats.length * bus.fare * 100 },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        bookNow(response.data.data.transactionId, selectedSeats);
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      alert(error.message);
    }
  };

  useEffect(() => {
    getBus();
  }, []);

  return (
    <Box p={3}>
      {bus && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                borderRadius: "8px",
                border: "1px solid #ddd",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="h4" fontWeight="bold" color="primary">
                {bus.name}
              </Typography>
              <Typography variant="subtitle1">{`${bus.from} - ${bus.to}`}</Typography>
              <Divider sx={{ my: 2, borderColor: "rgba(0, 0, 0, 0.2)" }} />
              {[
                { label: "Journey Date", value: bus.journeyDate },
                { label: "Fare", value: `₹${bus.fare}` },
                { label: "Departure Time", value: bus.departure },
                { label: "Arrival Time", value: bus.arrival },
                { label: "Capacity", value: bus.capacity },
                {
                  label: "Seats Left",
                  value: bus.capacity - bus.seatsBooked.length,
                },
              ].map((item, index) => (
                <Typography key={index} sx={{ mb: 1 }}>
                  <b>{item.label}:</b> {item.value}
                </Typography>
              ))}
              <Divider
                sx={{ my: 2, borderColor: "rgba(0, 0, 0, 0.2)", mb: 10 }}
              />
              <Box mt={2}>
                {[
                  {
                    label: "Selected Seats",
                    value: selectedSeats.join(", ") || "",
                    size: "1.2rem",
                  },
                  {
                    label: "Total Fare",
                    value: `₹${selectedSeats.length * bus.fare}`,
                    size: "1.2rem",
                  },
                ].map((item, index) => (
                  <Typography
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 2 }}
                  >
                    <Box
                      component="span"
                      sx={{ fontSize: "1rem", fontWeight: "bold", mr: 1 }}
                    >
                      {item.label}:
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        fontSize: item.size,
                        fontWeight: "bold",
                        color: "primary.main",
                      }}
                    >
                      {item.value}
                    </Box>
                  </Typography>
                ))}
              </Box>
              <StripeCheckout
                billingAddress
                amount={selectedSeats.length * bus.fare * 100}
                currency="INR"
                token={onToken}
                stripeKey="pk_test_51QdPvNDXhLCwOGLx3hgVQhuhJ4F6ng6Fwu0X5AKK0NxYvYaKYlxEJs81XhYxpiidl0H5jrvouHhQzelxdIxpD4jR00NQBkOUKb"
              >
                <Button
                  variant="contained"
                  color="primary"
                  disabled={selectedSeats.length === 0}
                >
                  Book Now
                </Button>
              </StripeCheckout>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <SeatSelection
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              bus={bus}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default BookNow;
