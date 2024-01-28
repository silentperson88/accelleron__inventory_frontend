import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "redux/ApiService/ApiService";

const configThunk = createAsyncThunk("config/api", async () => {
  const res = await ApiService.get("files/config", {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const profileConfigThunk = createAsyncThunk("profile-config/api", async () => {
  const res = await ApiService.get("user/config", {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const electricityFormConfigThunk = createAsyncThunk("electricity-config/api", async () => {
  const res = await ApiService.get("paysprint/config/electricity", {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const utilityBillForm = createAsyncThunk("electricity-config/api", async (type) => {
  const res = await ApiService.get(`paysprint/config/${type}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const equipmentConfig = createAsyncThunk("equipment-config/api", async () => {
  const res = await ApiService.get("files/equipment", {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export default configThunk;
