import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import PageTitle from "../../components/PageTitle";
import BusForm from "../../components/BusForm";
import axios from "axios";
import { hideLoading, showLoading } from "../../redux/AlertSlice";
import { useDispatch } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { AiFillDelete } from "react-icons-ai";
import { MdUpdate } from "react-icons-md";

function AdminBuses() {
  const [showBusForm, setShowBusForm] = useState(false);
  const [selectedBus, setSelectedBus] = useState();
  const [buses, setBuses] = useState();
  const [v, sv] = useState([]);
  const [state, setState] = useState(false);
  const [id, setId] = useState();

  const dispatch = useDispatch();
  const getAll = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/buses/get-all-buses",
        {},
        { header: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (response.data.sucess) {
        sv(response.data.data);
        dispatch(hideLoading);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteBus = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/buses/delete-bus",
        { _id: id },
        { header: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (response.data.sucess) {
        Window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAll();
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
          sx={{ background: "green" }}
          onClick={() => {
            setShowBusForm(true);
            setBuses(true);
          }}
        >
          Add Bus
        </Button>
      </Box>
      <BusForm
        showBusForm={showBusForm}
        setShowBusForm={setShowBusForm}
        type={buses}
        selectedBus={selectedBus}
      />
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minwidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow sx={{ background: "rgb(101,101,101,.2)" }}>
                <TableCell
                  sx={{ p: "15px", fontSize: "16px", fontWeight: "bold" }}
                  align="center"
                >
                  Bus Name
                </TableCell>
                <TableCell
                  sx={{ p: "15px", fontSize: "16px", fontWeight: "bold" }}
                  align="center"
                >
                  From
                </TableCell>
                <TableCell
                  sx={{ p: "15px", fontSize: "16px", fontWeight: "bold" }}
                  align="center"
                >
                  To
                </TableCell>
                <TableCell
                  sx={{ p: "15px", fontSize: "16px", fontWeight: "bold" }}
                  align="center"
                >
                  Departure
                </TableCell>
                <TableCell
                  sx={{ p: "15px", fontSize: "16px", fontWeight: "bold" }}
                  align="center"
                >
                  Arrival
                </TableCell>
                <TableCell
                  sx={{ p: "15px", fontSize: "16px", fontWeight: "bold" }}
                  align="center"
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{ p: "15px", fontSize: "16px", fontWeight: "bold" }}
                  align="center"
                >
                  Operation
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {v.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {row.name}
                  </TableCell>
                  <TableCell align="center">{row.from}</TableCell>
                  <TableCell align="center">{row.to}</TableCell>
                  <TableCell align="center">{row.departure}</TableCell>
                  <TableCell align="center">{row.arrival}</TableCell>
                  <TableCell align="center">{row.journeyDate}</TableCell>
                  <TableCell align="center">
                    <MdUpdate
                      size="30px"
                      onClick={() => {
                        setShowBusForm(true);
                        setBuses(false);
                        setSelectedBus(row);
                      }}
                    />
                    <AiFillDelete
                      size="30px"
                      onClick={() => {
                        setState(true);
                        setId(row._id);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {state ? (
          <Box
            sx={{
              position: "absolute",
              top: "40%",
              left: "40%",
              width: { md: "40vw", xs: "60vw" },
              background: "white",
              display: "flex",
              flexDirection: "column",
              p: "30px",
              zIndex: 3,
              textAlign: "center",
              boxShadow: "1px 1px 5px red",
            }}
          >
            <h5>Are you sure want to delete</h5>
            <Button variant="outline" sx={{ color: "red" }} onClick={deleteBus}>
              Delete Bus
            </Button>
            <Button
              variant="outline"
              sx={{ color: "blue", mt: "5px" }}
              onClick={() => {
                setState(false);
                setId(null);
              }}
            >
              cancel
            </Button>
          </Box>
        ) : (
          ""
        )}
      </Box>
    </>
  );
}
export default AdminBuses;
