import { createSlice } from "@reduxjs/toolkit";
import { resetStateThunk } from "redux/Thunks/Authentication";
import getAllfeedbacks from "redux/Thunks/feedback";

const initialState = {
  loading: "idle",
  list: [],
};

export const feedbackSlice = createSlice({
  name: "feedbackSlice",
  initialState,
  reducers: {
    reloadData(state) {
      state.loading = "pending";
    },
  },

  extraReducers: {
    [getAllfeedbacks.pending]: (state) => {
      if (state.list.length === 0) state.loading = "pending";
    },
    [getAllfeedbacks.fulfilled]: (state, { payload }) => {
      state.loading = "fullfilled";
      if (payload.type === "add") state.list = payload.data.data;
      else state.list.push(...payload.data.data);
    },
    [getAllfeedbacks.rejected]: (state) => {
      state.loading = "rejected";
    },
    [resetStateThunk.fulfilled]: (state) => {
      state.loading = "idle";
      state.list = [];
    },
  },
});

export const { reloadData } = feedbackSlice.actions;
export default feedbackSlice.reducer;
