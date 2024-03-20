import { createSlice } from "@reduxjs/toolkit";
import { getInventory } from "redux/Thunks/Inventory.thunk";
import Constants from "utils/Constants";

const initialState = {
  loading: "idle",
  list: [],
};

export const inventorySlice = createSlice({
  name: "inventorySlice",
  initialState,
  reducers: {
    reloadData(state) {
      state.loading = Constants.PENDING;
    },
  },

  extraReducers: {
    [getInventory.pending]: (state) => {
      if (state.list.length === 0) state.loading = Constants.PENDING;
    },
    [getInventory.fulfilled]: (state, { payload }) => {
      state.loading = Constants.FULFILLED;
      console.log("payload", payload);
      if (payload.type === "add") state.list = payload.data.data;
      else state.list.push(...payload.data.data);
    },
    [getInventory.rejected]: (state) => {
      state.loading = Constants.REJECTED;
    },
  },
});

export const { reloadData } = inventorySlice.actions;
export default inventorySlice.reducer;
