import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import Loader from "./Loader";
import { hideLoading, showLoading } from "../redux/AlertSlice";
import DefaultLayout from "./DefaultLayout";
import config from "../config";

function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.alerts.loading);
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();

  const validateToken = async () => {
    dispatch(showLoading());
    try {
      const res = await axios.post(
        `${config.API_BASE_URL}/users/getuser`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        dispatch(hideLoading());
      } else {
        dispatch(hideLoading());
        navigate("/login");
      }
    } catch (error) {
      dispatch(hideLoading());
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      {loading && <Loader />}
      {user && !loading ? <DefaultLayout>{children}</DefaultLayout> : null}
    </>
  );
}

export default ProtectedRoute;
