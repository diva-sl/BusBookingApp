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
  Typography,
  IconButton,
  Button,
  Divider,
  Tooltip,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb"; // Icon for canceled ticket
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Icon for booked ticket
import { Modal } from "antd";
import axios from "axios";
import config from "../config";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const getBookings = async () => {
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/bookings/get-bookings-by-user-id`,
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

  const handleCancelTicket = async (ticketId) => {
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/api/bookings/cancel-ticket`,
        { ticketId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.success) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === ticketId
              ? { ...booking, status: "canceled" }
              : booking
          )
        );
        alert("Ticket canceled successfully!");
      } else {
        alert("Failed to cancel ticket!");
      }
    } catch (error) {
      console.error(error);
      alert("Error canceling ticket");
    }
  };

  const handlePrint = () => {
    if (!selectedTicket) return;

    const isCanceled = selectedTicket?.status === "canceled";
    const totalFare =
      selectedTicket?.bus?.fare * selectedTicket?.seats.length || 0;
    const cancellationCharges = selectedTicket?.seats.length * 50 || 0;
    const refundAmount = totalFare - cancellationCharges;

    const printContent = `
    <html>
      <head>
        <title>Ticket Print</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f4f4f4;
          }
          h2 {
            color: darkblue;
          }
          .ticket-info {
            margin-top: 20px;
            background-color: #fff;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .ticket-info strong {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <h2>${selectedTicket?.bus?.name}</h2>
        <p><strong>From:</strong> ${selectedTicket?.bus?.from} - ${
      selectedTicket?.bus?.to
    }</p>
        <p><strong>Journey Date:</strong> ${
          selectedTicket?.bus?.journeyDate
        }</p>
        <p><strong>Journey Time:</strong> ${selectedTicket?.bus?.departure}</p>
        <p><strong>Arrival Time:</strong> ${selectedTicket?.bus?.arrival}</p>
        <p><strong>Seat Numbers:</strong> ${selectedTicket?.seats?.join(
          ", "
        )}</p>
        <p><strong>Total Fare:</strong> ₹${totalFare}</p>
        ${
          isCanceled
            ? `
          <p><strong>Cancellation Charges:</strong> ₹${cancellationCharges}</p>
          <p><strong>Refund Amount:</strong> ₹${refundAmount}</p>
        `
            : ""
        }
      </body>
    </html>
  `;

    const printWindow = window.open("", "_blank", "width=600,height=600");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
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
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", marginBottom: 2, color: "darkblue" }}
        >
          Bookings
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Bus Name",
                "Bus Number",
                "Journey Date",
                "Seats",
                "Status",
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
                  <TableCell align="center">
                    {booking.seats.join(", ")}
                  </TableCell>
                  <TableCell align="center">
                    {booking.status === "canceled" ? (
                      <Tooltip title="Canceled Ticket">
                        <DoNotDisturbIcon color="error" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Booked Ticket">
                        <CheckCircleIcon color="success" />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip
                      title={
                        booking.status === "canceled"
                          ? "Canceled Ticket"
                          : "View Ticket"
                      }
                    >
                      <IconButton
                        onClick={() => {
                          setSelectedTicket(booking);
                          setShowPrintModal(true);
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    {booking.status !== "canceled" && (
                      <Tooltip title="Cancel Ticket">
                        <IconButton
                          onClick={() => handleCancelTicket(booking._id)}
                        >
                          <CancelIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No Bookings Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {showPrintModal && (
        <Modal
          title={<Typography variant="h6">Print Ticket</Typography>}
          onCancel={() => {
            setShowPrintModal(false);
            setSelectedTicket(null);
          }}
          open={showPrintModal}
          footer={null}
        >
          <Box sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              {selectedTicket?.bus?.name}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {selectedTicket?.bus?.from} - {selectedTicket?.bus?.to}
            </Typography>
            <Divider sx={{ marginY: 2 }} />
            <Typography variant="body2" gutterBottom>
              <strong>Journey Date:</strong> {selectedTicket?.bus?.journeyDate}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Journey Time:</strong> {selectedTicket?.bus?.departure}
            </Typography>
            <Divider sx={{ marginY: 2 }} />
            <Typography variant="body2" gutterBottom>
              <strong>Seat Numbers:</strong> {selectedTicket?.seats?.join(", ")}
            </Typography>
            <Divider sx={{ marginY: 2 }} />
            <Typography variant="body2" gutterBottom>
              <strong>Total Fare:</strong> ₹
              {selectedTicket?.bus?.fare * selectedTicket?.seats.length}
            </Typography>

            {selectedTicket?.status === "canceled" && (
              <>
                <Typography variant="body2" gutterBottom>
                  <strong>Cancellation Charges:</strong> ₹
                  {selectedTicket?.seats.length * 50}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Refund Amount:</strong> ₹
                  {selectedTicket?.bus?.fare * selectedTicket?.seats.length -
                    selectedTicket?.seats.length * 50}
                </Typography>
              </>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                marginTop: 3,
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setShowPrintModal(false);
                  setSelectedTicket(null);
                }}
              >
                Close
              </Button>
              <Button variant="contained" color="primary" onClick={handlePrint}>
                Print Ticket
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
}

export default Bookings;
