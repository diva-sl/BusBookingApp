import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import Loader from "./Loader";
import { hideLoading, showLoading } from "../redux/AlertSlice.js";
import DefaultLayout from "./DefaultLayout";

function ProtecedRoute({ children }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.alerts.loading);
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();

  const validateToken = async () => {
    try {
      dispatch(showLoading());

      const response = await axios.post(
        "http://localhost:5000/user/getuser",
        {},
        { header: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (response.data.sucess) {
        dispatch(setUser(response.data.user));
        dispatch(hideLoading());
        console.log("me" + loading, response.data.user);
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
    console.log("me" + loading, user);
  }, []);

  return (
    <div>{user !== null && <DefaultLayout>{children}</DefaultLayout>}</div>
  );
}

export default ProtecedRoute;
