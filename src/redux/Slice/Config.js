import { createSlice } from "@reduxjs/toolkit";
import { resetStateThunk } from "redux/Thunks/Authentication";
import { profileConfigThunk } from "redux/Thunks/Config";

const initialState = {
  profileLoading: "idle",
  refetchProfileConfig: true,
  profileConfig: {},
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {},

  extraReducers: {
    [profileConfigThunk.pending]: (state) => {
      state.loading = "pending";
    },
    [profileConfigThunk.fulfilled]: (state, action) => {
      state.profileLoading = "fulfilled";
      state.profileConfig = action?.payload?.data;
      state.refetchProfileConfig = false;
    },
    [profileConfigThunk.rejected]: (state) => {
      state.loading = "rejected";
    },

    [resetStateThunk.fulfilled]: (state) => {
      state.profileLoading = "idle";
      state.refetchProfileConfig = true;
      state.profileConfig = {};
    },
  },
});

export default configSlice.reducer;
