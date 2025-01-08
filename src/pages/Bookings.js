import React, { useEffect, useRef, useState } from "react";
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
  Divider,
  Button,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Modal } from "antd";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import PageTitle from "../components/PageTitle";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const getBookings = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/bookings/get-bookings-by-user-id",
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
    getBookings();
  }, []);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    // onAfterPrint: () => console.log("Printing completed."),
    // onPrintError: (error) => console.error("Error during printing:", error),
  });

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
                      onClick={() => {
                        setSelectedTicket(booking);
                        setShowPrintModal(true);
                      }}
                    >
                      <VisibilityIcon
                        sx={{
                          color: "#6c757d",
                          "&:hover": { color: "#007bff" },
                        }}
                      />
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
      {showPrintModal && (
        <Modal
          title={<Typography variant="h6">Print Ticket</Typography>}
          onCancel={() => {
            setShowPrintModal(false);
            setSelectedTicket(null);
          }}
          open={showPrintModal}
          onOk={handlePrint}
          // footer={null}
          // afterClose={() => setSelectedTicket(null)} // Reset selected ticket after modal closes
        >
          <div className="d-flex" ref={componentRef} sx={{ padding: 2 }}>
            <>
              <Typography variant="h6" gutterBottom>
                {selectedTicket.bus.name}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                {selectedTicket.bus.from} - {selectedTicket.bus.to}
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              <Typography variant="body2" gutterBottom>
                <strong>Journey Date:</strong> {selectedTicket.bus.journeyDate}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Journey Time:</strong> {selectedTicket.bus.departure}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Arrival Time:</strong> {selectedTicket.bus.arrival}
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              <Typography variant="body2" gutterBottom>
                <strong>Seat Numbers:</strong> {selectedTicket.seats.join(", ")}
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              <Typography variant="h6" color="textSecondary">
                Total Amount: ₹
                {selectedTicket.bus.fare * selectedTicket.seats.length} -/
              </Typography>
            </>

            {/* <Typography variant="body2" color="textSecondary">
                No ticket selected.
              </Typography> */}

            {/* <Box
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
              Cancel
            </Button>

            <Button variant="contained" color="primary" onClick={handlePrint}>
              <PrintIcon sx={{ marginRight: 1 }} />
              Print
            </Button>
          </Box> */}
          </div>
        </Modal>
      )}
    </Box>
  );
}

export default Bookings;
