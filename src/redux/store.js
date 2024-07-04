import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "./AlertSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    alerts: alertReducer,
    user: userReducer,
  },
});

export default store;
