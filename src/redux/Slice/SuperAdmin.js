import { createSlice } from "@reduxjs/toolkit";
import { resetStateThunk } from "redux/Thunks/Authentication";
import AdminListThunk from "redux/Thunks/SuperAdmin";

const initialState = {
  loading: "idle",
  lists: [],
};

export const superAdminSlice = createSlice({
  name: "superadmin",
  initialState,
  reducers: {},

  extraReducers: {
    [AdminListThunk.pending]: (state) => {
      if (state.lists.length === 0) state.loading = "pending";
    },
    [AdminListThunk.fulfilled]: (state, { payload }) => {
      state.loading = "fullfilled";
      if (payload?.type === "add") {
        state.lists = payload.data;
      } else {
        state.lists.push(...payload.data);
      }
    },
    [AdminListThunk.rejected]: (state) => {
      state.loading = "rejected";
    },
    [resetStateThunk.fulfilled]: (state) => {
      state.loading = "idle";
      state.lists = [];
    },
  },
});

export default superAdminSlice.reducer;
