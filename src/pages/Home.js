import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { showLoading, hideLoading } from "../redux/AlertSlice";
import { useEffect, useState } from "react";
import Bus from "../components/Bus";
import { Box, Grid, Container } from "@mui/material";

function Home() {
  const user = useSelector((state) => state.users.user);
  const [buses, setBuses] = useState([]);
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

  useEffect(() => {
    getBuses();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Grid container spacing={2}>
          {buses
            .filter((bus) => bus.status === "Yet To Start")
            .map((bus) => (
              <Grid item xs={12} sm={6} md={6} key={bus._id}>
                <Bus bus={bus} />
              </Grid>
            ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default Home;
