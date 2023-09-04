import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiService from "redux/ApiService/ApiService";

const getAllMobileUsers = createAsyncThunk("mobile-users-listing/api", async () => {
  const res = await ApiService.get(`user`, {
    // headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export default getAllMobileUsers;
