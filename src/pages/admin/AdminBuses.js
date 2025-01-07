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
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import PageTitle from "../../components/PageTitle";
import BusForm from "../../components/BusForm";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/AlertSlice";

function AdminBuses() {
  const [showBusForm, setShowBusForm] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [buses, setBuses] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busToDelete, setBusToDelete] = useState(null);

  const dispatch = useDispatch();
  const getBuses = async () => {
    try {
      // dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/buses/get-all-buses",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // dispatch(hideLoading());
      if (response.data.success) {
        setBuses(response.data.data);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      // dispatch(hideLoading());
    }
  };

  const deleteBus = async () => {
    try {
      // dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/buses/delete-bus",
        { _id: busToDelete },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // dispatch(hideLoading());
      if (response.data.success) {
        setBuses(buses.filter((bus) => bus._id !== busToDelete));
        setConfirmDelete(false);
        setBusToDelete(null);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      // dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getBuses();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <PageTitle title="Buses" />
        <Button
          variant="contained"
          sx={{ background: "royalblue" }}
          onClick={() => {
            setShowBusForm(true);
            setSelectedBus(null);
          }}
        >
          Add Bus
        </Button>
      </Box>

      <BusForm
        showBusForm={showBusForm}
        setShowBusForm={setShowBusForm}
        type={selectedBus ? "edit" : "add"}
        selectedBus={selectedBus}
        refreshBuses={getBuses}
      />
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow sx={{ background: "rgb(101,101,101,.2)" }}>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Bus Name
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  From
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  To
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Departure
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Arrival
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Date
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buses.length > 0 ? (
                buses.map((bus) => (
                  <TableRow key={bus._id}>
                    <TableCell align="center">{bus.name}</TableCell>
                    <TableCell align="center">{bus.from}</TableCell>
                    <TableCell align="center">{bus.to}</TableCell>
                    <TableCell align="center">{bus.departure}</TableCell>
                    <TableCell align="center">{bus.arrival}</TableCell>
                    <TableCell align="center">{bus.journeyDate}</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <EditIcon
                          onClick={() => {
                            setShowBusForm(true);
                            setSelectedBus(bus);
                          }}
                          sx={{ cursor: "pointer", color: "#6c757d" }}
                        />
                        <DeleteIcon
                          onClick={() => {
                            setConfirmDelete(true);
                            setBusToDelete(bus._id);
                          }}
                          sx={{ cursor: "pointer", color: "#c82333" }}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No buses available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {confirmDelete && (
          <Box
            sx={{
              position: "absolute",
              top: "40%",
              left: "40%",
              width: { md: "40vw", xs: "60vw" },
              background: "white",
              padding: "30px",
              zIndex: 3,
              textAlign: "center",
              boxShadow: "1px 1px 5px red",
            }}
          >
            <h5>Are you sure you want to delete this bus?</h5>
            <Button
              variant="contained"
              sx={{ background: "red", color: "white", marginRight: "10px" }}
              onClick={deleteBus}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              sx={{ background: "blue", color: "white" }}
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
}

export default AdminBuses;
