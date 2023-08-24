import { createSlice } from "@reduxjs/toolkit";
import { resetStateThunk } from "redux/Thunks/Authentication";
import { getAllFieldsThunk } from "redux/Thunks/Configuration";

const initialState = {
  loading: "idle",
  list: {
    dyamicField: [],
    staticField: [],
  },
};

export const dynamicFieldSlice = createSlice({
  name: "dynamicfields",
  initialState,
  reducers: {
    loadDynamicField: (state, action) => {
      state.list.dyamicField.push(...action.payload);
    },
  },

  extraReducers: {
    [getAllFieldsThunk.pending]: (state) => {
      state.loading = "pending";
    },
    [getAllFieldsThunk.fulfilled]: (state, action) => {
      state.loading = "fullfilled";
      const dynamicListData = action.payload.data.dyamicField;
      state.list.dyamicField = dynamicListData.reverse();
      state.list.staticField = action.payload.data.staticField;
    },
    [getAllFieldsThunk.rejected]: (state) => {
      state.loading = "rejected";
    },
    [resetStateThunk.fulfilled]: (state) => {
      state.loading = "idle";
      state.list.dyamicField = [];
      state.list.staticField = [];
    },
  },
});

export const { loadDynamicField } = dynamicFieldSlice.actions;

export default dynamicFieldSlice.reducer;
