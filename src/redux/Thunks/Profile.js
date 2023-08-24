import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "../ApiService/ApiService";

const ProfileThunk = createAsyncThunk("user/get", async () => {
  const res = await ApiService.get(`users/profile`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export default ProfileThunk;
