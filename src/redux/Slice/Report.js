import { createSlice } from "@reduxjs/toolkit";
import { resetStateThunk } from "redux/Thunks/Authentication";
import { getAllReports, getAllReportTypes } from "redux/Thunks/Report";
import Constants from "utils/Constants";

const initialState = {
  loading: "idle",
  reportType: [],
  reportLoading: "idle",
  reportList: [],
};

export const reportSlice = createSlice({
  name: "reportSlice",
  initialState,
  reducers: {
    removeReport(state, action) {
      const index = state.reportList.findIndex(
        (item) => item?.[Constants.MONGOOSE_ID] === action.payload
      );
      state.reportList.splice(index, 1);
    },
    removeReportType(state, action) {
      const index = state.reportType.findIndex(
        (item) => item?.[Constants.MONGOOSE_ID] === action.payload
      );
      state.reportType.splice(index, 1);
    },

    reloadData(state) {
      state.loading = "pending";
    },
  },

  extraReducers: {
    [getAllReportTypes.pending]: (state) => {
      if (state.reportType.length === 0) state.loading = "pending";
    },
    [getAllReportTypes.fulfilled]: (state, { payload }) => {
      state.loading = "fullfilled";
      if (payload.type === "add") state.reportType = payload.data.data;
      else state.reportType.push(...payload.data.data);
    },
    [getAllReportTypes.rejected]: (state) => {
      state.loading = "rejected";
    },
    [getAllReports.pending]: (state) => {
      if (state.reportList.length === 0) state.reportLoading = "pending";
    },
    [getAllReports.fulfilled]: (state, { payload }) => {
      state.reportLoading = "fullfilled";
      if (payload.type === "add") state.reportList = payload.data.data;
      else state.reportList.push(...payload.data);
    },
    [getAllReports.rejected]: (state) => {
      state.reportLoading = "rejected";
    },
    [resetStateThunk.fulfilled]: (state) => {
      state.reportList = [];
      state.reportType = [];
    },
  },
});

export const { removeReport, removeReportType, reloadData } = reportSlice.actions;
export default reportSlice.reducer;
