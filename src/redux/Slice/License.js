import { createSlice } from "@reduxjs/toolkit";
import { resetStateThunk } from "redux/Thunks/Authentication";
import licenseListThunk, { accountLicenseThunk } from "redux/Thunks/License";

const initialState = {
  licenseLoading: "idle",
  ownerLicenseLoading: "idle",
  allLicense: [],
  permissions: [],
};

export const LicenseSlice = createSlice({
  name: "License",
  initialState,
  reducers: {},

  extraReducers: {
    [licenseListThunk.pending]: (state) => {
      state.licenseLoading = "pending";
    },
    [licenseListThunk.fulfilled]: (state, { payload }) => {
      state.licenseLoading = "fullfilled";
      state.allLicense = payload.data;
    },
    [licenseListThunk.rejected]: (state) => {
      state.licenseLoading = "rejected";
    },
    [accountLicenseThunk.pending]: (state) => {
      state.ownerLicenseLoading = "pending";
    },
    [accountLicenseThunk.fulfilled]: (state, { payload }) => {
      state.ownerLicenseLoading = "fullfilled";
      state.permissions = payload.data;
    },
    [accountLicenseThunk.rejected]: (state) => {
      state.ownerLicenseLoading = "rejected";
    },
    [resetStateThunk.fulfilled]: (state) => {
      state.licenseLoading = "idle";
      state.ownerLicenseLoading = "idle";
      state.allLicense = [];
      state.permissions = [];
    },
  },
});

export default LicenseSlice.reducer;
