import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: "idle",
  status: localStorage.getItem("token") ? "authenticated" : "unauthenticated",
  role: "unauthorizedUser",
  accessType: "",
};

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    updateAuthenticationStatus(state, action) {
      state.status = action.payload;
    },
    updateRole(state, action) {
      state.role = action.payload;
    },
    updateAccessType(state, action) {
      state.accessType = action.payload;
    },
  },

  extraReducers: () => {},
});

export const { updateAuthenticationStatus, updateRole, updateAccessType } =
  authenticationSlice.actions;
export default authenticationSlice.reducer;
