import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "./AlertSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    alerts: alertReducer,
    users: userReducer,
  },
});

export default store;
