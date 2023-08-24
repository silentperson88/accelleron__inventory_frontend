import { createSlice } from "@reduxjs/toolkit";
import { resetStateThunk } from "redux/Thunks/Authentication";
import shiftListThunk, { shiftByIdThunk } from "redux/Thunks/DalShift";
import { dalShitFiltersThunk } from "redux/Thunks/Filter";
import Constants from "utils/Constants";

const initialState = {
  loading: "idle",
  shiftList: [],
};

export const dalShiftSlice = createSlice({
  name: "dalShift",
  initialState,
  reducers: {
    loadshiftData(state, action) {
      state.shiftList.push(...action.payload.data);
    },
    removeShift(state, action) {
      const index = state.shiftList.findIndex(
        (item) => item?.[Constants.MONGOOSE_ID] === action.payload
      );
      state.shiftList.splice(index, 1);
    },
    reloadData(state) {
      state.loading = "pending";
    },
  },

  extraReducers: {
    [shiftListThunk.pending]: (state) => {
      state.loading = "pending";
    },
    [shiftListThunk.fulfilled]: (state, { payload }) => {
      state.loading = "fullfilled";
      state.shiftList = payload.data;
    },
    [shiftListThunk.rejected]: (state) => {
      state.loading = "rejected";
    },
    [dalShitFiltersThunk.pending]: (state) => {
      if (state.shiftList.length === 0) state.loading = "pending";
    },
    [dalShitFiltersThunk.fulfilled]: (state, { payload }) => {
      state.loading = "fullfilled";
      // sort by start date in descending order
      const filteredShift = payload.data.data.shiftData.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );
      if (payload.type === "add") state.shiftList = filteredShift;
      else state.shiftList.push(...filteredShift);
    },
    [dalShitFiltersThunk.rejected]: (state) => {
      state.loading = "rejected";
    },
    [shiftByIdThunk.pending]: (state) => {
      if (state.shiftList.length === 0) state.loading = "pending";
    },
    [shiftByIdThunk.fulfilled]: (state, { payload }) => {
      state.loading = "fullfilled";
      state.shiftList = [payload.data.data];
    },
    [shiftByIdThunk.rejected]: (state) => {
      state.loading = "rejected";
    },
    [resetStateThunk.fulfilled]: (state) => {
      state.loading = "idle";
      state.shiftList = [];
    },
  },
});

export const { loadshiftData, removeShift, reloadData } = dalShiftSlice.actions;
export default dalShiftSlice.reducer;
