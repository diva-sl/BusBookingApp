import { createSlice } from "@reduxjs/toolkit";

const AlertSlice = createSlice({
  name: "alert",
  initailState: {
    loading: false,
  },
  reducers: {
    showLoading: (state, action) => {
      state.loading = true;
    },
    hideLoading: (state, action) => {
      state.loading = false;
    },
  },
});

export const { showLoading, hideLoading } = AlertSlice.actions;
export default AlertSlice.reducer;
