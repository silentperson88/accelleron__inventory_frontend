import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openSnackbar: false,
  snackbarMessage: "",
  notificationType: "success",
};

export const NotificationSlice = createSlice({
  name: "Notification",
  initialState,
  reducers: {
    openSnackbar(state, action) {
      state.openSnackbar = true;
      state.snackbarMessage = action.payload?.message;
      state.notificationType = action.payload?.notificationType;
    },
    closeSnackBar(state) {
      state.openSnackbar = false;
      state.snackbarMessage = "";
    },
  },

  extraReducers: () => {},
});

export const { openSnackbar, closeSnackBar } = NotificationSlice.actions;

export default NotificationSlice.reducer;
