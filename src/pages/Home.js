import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { showLoading, hideLoading } from "../redux/AlertSlice";
import { useEffect, useState } from "react";
import Bus from "../components/Bus";
import {
  Box,
  Grid,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";

function Home() {
  const user = useSelector((state) => state.users.user);
  const [filters, setFilters] = useState({ from: "", to: "", journeyDate: "" });
  const [buses, setBuses] = useState([]);
  const dispatch = useDispatch();

  const getBuses = async () => {
    const activeFilters = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        activeFilters[key] = filters[key];
      }
    });

    try {
      // dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/buses/get-all-buses",
        activeFilters,
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

  useEffect(() => {
    getBuses();
  }, []);

  const handleClearFilters = () => {
    setFilters({ from: "", to: "", journeyDate: "" });
    getBuses();
  };

  return (
    <Container
      sx={{
        mt: 4,
        maxHeight: "calc(80vh - 20px)",
        overflowY: "auto",
        padding: 2,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          marginBottom: 4,
          borderRadius: 2,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            marginBottom: 2,
            textAlign: "center",
            color: "#3a47d5",
            fontWeight: "bold",
          }}
        >
          Find Your Bus
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="From"
              variant="outlined"
              value={filters.from}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, from: e.target.value }))
              }
              sx={{
                backgroundColor: "#fff",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="To"
              variant="outlined"
              value={filters.to}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, to: e.target.value }))
              }
              sx={{
                backgroundColor: "#fff",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Journey Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              value={filters.journeyDate}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  journeyDate: e.target.value,
                }))
              }
              sx={{
                backgroundColor: "#fff",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={getBuses}
                fullWidth
                sx={{
                  borderRadius: "5px",
                  fontWeight: "bold",
                }}
              >
                Filter
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClearFilters}
                fullWidth
                sx={{
                  borderRadius: "5px",
                  fontWeight: "bold",
                }}
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Box>
        <Grid container spacing={3}>
          {buses.length > 0 ? (
            buses
              .filter((bus) => bus.status === "Yet To Start")
              .map((bus) => (
                <Grid item xs={12} sm={6} md={4} key={bus._id}>
                  <Bus bus={bus} />
                </Grid>
              ))
          ) : (
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{
                textAlign: "center",
                width: "100%",
                mt: 2,
                color: "#3a47d5",
              }}
            >
              No buses available. Please modify your search criteria.
            </Typography>
          )}
        </Grid>
      </Box>
    </Container>
  );
}

export default Home;
