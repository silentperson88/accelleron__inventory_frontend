import { createSlice } from "@reduxjs/toolkit";
import { resetStateThunk } from "redux/Thunks/Authentication";
import { getAllSafetyThunk } from "redux/Thunks/SafetyCard";

const initialState = {
  loading: "pending",
  list: [],
  screens: [],
};

export const safetyCardSlice = createSlice({
  name: "safetycard",
  initialState,
  reducers: {
    updateList(state, action) {
      state.list = action.payload;
      state.loading = "fullfilled";
    },
    loadSafetyCardData(state, action) {
      state.list.push(...action.payload);
    },
    updateSafetyCardData(state, action) {
      const mongooseId = "_id";
      const index = state.list.findIndex(
        (item) => item?.[mongooseId] === action.payload[mongooseId]
      );
      state.list[index] = action.payload;
    },
    removeSafetyCard(state, action) {
      const mongooseId = "_id";
      const index = state.list.findIndex((item) => item?.[mongooseId] === action.payload);
      state.list.splice(index, 1);
    },
    reloadData(state) {
      state.loading = "pending";
    },
  },

  extraReducers: {
    [getAllSafetyThunk.pending]: (state) => {
      if (state.list.length === 0) state.loading = "pending";
    },
    [getAllSafetyThunk.fulfilled]: (state, action) => {
      state.loading = "fullfilled";
      state.list = action.payload.data;
    },
    [getAllSafetyThunk.rejected]: (state) => {
      state.loading = "rejected";
    },
    [resetStateThunk.fulfilled]: (state) => {
      state.loading = "idle";
      state.list = [];
      state.screens = [];
    },
  },
});

export const {
  updateList,
  loadSafetyCardData,
  updateSafetyCardData,
  reloadData,
  removeSafetyCard,
} = safetyCardSlice.actions;

export default safetyCardSlice.reducer;
