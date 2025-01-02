import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Button, Typography, Grid } from "@mui/material";
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

  const bookNow = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `http://localhost:5000/api/booking/book-seat`,
        {
          bus: bus._id,
          seats: selectedSeats,
        },
        { header: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        alert(response.data.message);
        navigate("/booking");
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
        {
          token,
          amount: selectedSeats.length * bus.fare * 100,
        },
        { header: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        alert(response.data.message);
        bookNow(response.data.data.transactionId);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      alert(error.message);
    }
  };
  console.log(bus);
  useEffect(() => {
    getBus();
  }, []);

  return (
    <Box p={3}>
      {bus && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {bus.name}
            </Typography>
            <Typography variant="subtitle1">
              {bus.from} - {bus.to}
            </Typography>
            <Box mt={2}>
              <Typography>
                <b>Journey Date:</b> {bus.journeyDate}
              </Typography>
              <Typography>
                <b>Fare:</b> ₹{bus.fare}
              </Typography>
              <Typography>
                <b>Departure Time:</b> {bus.departure}
              </Typography>
              <Typography>
                <b>Arrival Time:</b> {bus.arrival}
              </Typography>
              <Typography>
                <b>Capacity:</b> {bus.capacity}
              </Typography>
              <Typography>
                <b>Seats Left:</b> {bus.capacity - bus.seatsBooked.length}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <SeatSelection
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              bus={bus}
            />
          </Grid>
          <Grid item xs={12}>
            <Box mt={2}>
              <Typography variant="h6">
                Selected Seats: {selectedSeats.join(", ")}
              </Typography>
              <Typography variant="h6">
                Total Fare: ₹{selectedSeats.length * bus.fare}
              </Typography>
              <StripeCheckout
                billingAddress
                token={onToken}
                amount={selectedSeats.length * bus.fare * 100}
                currency="INR"
                stripeKey="pk_test_51IYnC0SIR2AbPxU0TMStZwFUoaDZle9yXVygpVIzg36LdpO8aSG8B9j2C0AikiQw2YyCI8n4faFYQI5uG3Nk5EGQ00lCfjXYvZ"
              >
                <Button
                  variant="contained"
                  color="primary"
                  disabled={selectedSeats.length === 0}
                >
                  Book Now
                </Button>
              </StripeCheckout>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default BookNow;
