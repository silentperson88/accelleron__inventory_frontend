import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "../ApiService/ApiService";

// Pending
const safetyCardUpdateFormThunk = createAsyncThunk("safetycardupdateform/api", async (params) => {
  const res = await ApiService.get(`safety-cards/form/${params.id}/${params.cardType}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const createSafetyCardThunk = createAsyncThunk("safetycard/api", async (body) => {
  const res = await ApiService.post(
    "safety-cards",
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});

export const getAllSafetyThunk = createAsyncThunk("getSafetyCard/api", async (param) => {
  const res = await ApiService.get(`safety-cards?${param}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const updateSafetyCardThunk = createAsyncThunk("updatesafetycard/api", async (body) => {
  const res = await ApiService.patch(
    `safety-cards/${body.id}`,
    { ...body.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});

export const deleteSafetyCardThunk = createAsyncThunk("deletesafetycard/api", async (id) => {
  const res = await ApiService.delete(`safety-cards/${id}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export default safetyCardUpdateFormThunk;
