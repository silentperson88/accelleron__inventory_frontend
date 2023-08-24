import { createSlice } from "@reduxjs/toolkit";
import { resetStateThunk } from "redux/Thunks/Authentication";
import ProductListThunk from "redux/Thunks/Equipment";

const initialState = {
  loading: "idle",
  list: [],
};

export const productSlice = createSlice({
  name: "productSlice",
  initialState,
  reducers: {
    reloadData(state) {
      state.loading = "pending";
    },
  },

  extraReducers: {
    [ProductListThunk.pending]: (state) => {
      if (state.list.length === 0) state.loading = "pending";
    },
    [ProductListThunk.fulfilled]: (state, { payload }) => {
      state.loading = "fullfilled";
      if (payload.type === "add") state.list = payload.data.data;
      else state.list.push(...payload.data.data);
    },
    [ProductListThunk.rejected]: (state) => {
      state.loading = "rejected";
    },
    [resetStateThunk.fulfilled]: (state) => {
      state.loading = "idle";
      state.list = [];
    },
  },
});

export const { reloadData } = productSlice.actions;
export default productSlice.reducer;
