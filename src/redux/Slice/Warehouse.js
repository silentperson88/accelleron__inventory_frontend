import { createSlice } from "@reduxjs/toolkit";
import { resetStateThunk } from "redux/Thunks/Authentication";
import { warehouseListThunk, productByWarehouseIdThunk } from "redux/Thunks/Warehouse";
import Constants from "utils/Constants";

const initialState = {
  loading: "idle",
  list: [],
  warehouseProductsLoading: "idle",
  warehouseProduct: {
    warehouseDetails: {},
    equipment: [],
  },
};

export const warehouseSlice = createSlice({
  name: "warehouse",
  initialState,
  reducers: {
    removeWarehouse: (state, action) => {
      state.list = state.list.filter((item) => item?.[Constants.MONGOOSE_ID] !== action.payload);
    },
    removeEquipment: (state, action) => {
      state.warehouseProduct.equipment = state.warehouseProduct.equipment.filter(
        (item) => item?.[Constants.MONGOOSE_ID] !== action.payload
      );
    },
    reloadWarehouse: (state) => {
      state.loading = "pending";
    },
  },

  extraReducers: {
    [warehouseListThunk.pending]: (state) => {
      if (state.list.length === 0) state.loading = "pending";
    },
    [warehouseListThunk.fulfilled]: (state, { payload }) => {
      state.loading = "fullfilled";
      if (payload?.type === "add") {
        state.list = payload?.data?.data;
      } else {
        state.list.push(...payload.data.data);
      }
    },
    [warehouseListThunk.rejected]: (state) => {
      state.loading = "rejected";
    },
    [productByWarehouseIdThunk.pending]: (state) => {
      if (Object.keys(state.warehouseProduct.warehouseDetails).length === 0)
        state.warehouseProductsLoading = "pending";
    },
    [productByWarehouseIdThunk.fulfilled]: (state, { payload }) => {
      state.warehouseProductsLoading = "fullfilled";
      if (payload?.type === "add") {
        state.warehouseProduct.warehouseDetails = payload?.data?.data[0];
        state.warehouseProduct.equipment = payload?.data?.data[0]?.equipments;
      } else {
        state.warehouseProduct.equipment.push(...(payload.data.data[0]?.equipments || []));
      }
    },
    [productByWarehouseIdThunk.rejected]: (state) => {
      state.warehouseProductsLoading = "rejected";
    },
    [resetStateThunk.fulfilled]: (state) => {
      state.loading = "idle";
      state.warehouseProductsLoading = "idle";
      state.list = [];
      state.warehouseProduct = {
        warehouseDetails: {},
        equipment: [],
      };
    },
  },
});

export const { removeWarehouse, removeEquipment, reloadWarehouse } = warehouseSlice.actions;

export default warehouseSlice.reducer;
