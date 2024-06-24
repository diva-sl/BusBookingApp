import { Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import StripeCheckOut from "react-stripe-checkout";
import { hideLoading, showLoading } from "../redux/AlertSlice";
import SeatSelection from "../components/SeatSelection";

function BookNow() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);
  const getBus = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `http://localhost:5000/buses/get-bus-by-id`,
        {
          _id: params.id,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(hideLoading());
      if (response.data.sucess) {
        setBus(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
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
        message.success(response.data.message);
        navigate("/booking");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
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
        message.success(gresponse.data.message);
        bookNow(response.data.data.transactionId);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.message);
    }
  };
  useEffect(() => {
    getBus();
  }, []);
  return (
    <div>
      {bus && (
        <Row className="mt-3" gutter={[30, 30]}>
          <Col lg={12} xs={24} sm={24}>
            <h1 className="text-2xl primary-text">{bus.name}</h1>
            <h1 className="text-md">
              {bus.from}-{bus.to}
            </h1>
            <hr />
            <div className="flex flex-col gap-2">
              <p className="text-md">Journey Date : {bus.journeyDate} </p>
              <p className="text-md">Fare : {bus.fare} </p>
              <p className="text-md">Departure Time : {bus.Departure} </p>
              <p className="text-md">Arrival Time : {bus.arrival} </p>
              <p className="text-md">Capacity : {bus.capacity} </p>
              <p className="text-md">
                Seats Left : {bus.capacity - bus.seatsBooked.length}
              </p>
            </div>
            <hr />
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl">
                Selected Seats:{selectedSeats.join(", ")}
              </h1>
              <h1 className="text-2xl mt-2">
                Fare : {bus.fare * selectedSeats.length} /-
              </h1>
              <hr />
              <StripeCheckOut
                billingAddress
                token={onToken}
                amount={bus.fare * selectedSeats.length * 100}
                currency="INR"
                stripeKey="pk_test_51IYnC0SIR2AbPxU0TMStZwFUoaDZle9yXVygpVIzg36LdpO8aSG8B9j2C0AikiQw2YyCI8n4faFYQI5uG3Nk5EGQ00lCfjXYvZ"
              >
                <button
                  className={`primary-btn ${
                    selectedSeats.length === 0 && "disabled-btn"
                  }`}
                  disabled={selectedSeats.length === 0}
                >
                  Book Now
                </button>
              </StripeCheckOut>
            </div>
          </Col>
          <Col lg={12} xs={24} sm={24}>
            <SeatSelection>
              selectedSeats ={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              bus={bus}
            </SeatSelection>
          </Col>
        </Row>
      )}
    </div>
  );
}
export default BookNow;
