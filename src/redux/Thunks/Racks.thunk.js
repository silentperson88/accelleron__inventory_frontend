import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiService from "redux/ApiService/ApiService";
import Sessions from "utils/Sessions";

const createRack = createAsyncThunk("create-rack", async (rack) => {
  const res = await ApiService.post("rack", rack, {
    headers: {
      Authorization: `Bearer ${Sessions.userToken}`,
    },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const getRacks = createAsyncThunk("get-racks", async (param) => {
  const res = await ApiService.get(`rack`, {
    headers: {
      Authorization: `Bearer ${Sessions.userToken}`,
    },
  })
    .then((r) => r)
    .catch((err) => err.response);

  const params = new URLSearchParams(param);
  const page = params.get("page");
  return page === "0"
    ? { data: res.data, type: "add", status: res.status }
    : { data: res.data, type: "append", status: res.status };
});

export const createPallet = createAsyncThunk("create-pallet", async (pallet) => {
  const res = await ApiService.post("pallet", pallet, {
    headers: {
      Authorization: `Bearer ${Sessions.userToken}`,
    },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const getPallets = createAsyncThunk("get-pallets", async (param) => {
  const res = await ApiService.get(`rack/pallet?${param}`, {
    headers: {
      Authorization: `Bearer ${Sessions.userToken}`,
    },
  })
    .then((r) => r)
    .catch((err) => err.response);

  const params = new URLSearchParams(param);
  const page = params.get("page");
  return page === "0"
    ? { data: res.data, type: "add", status: res.status }
    : { data: res.data, type: "append", status: res.status };
});

export const updatePallet = createAsyncThunk("update-pallet", async (pallet) => {
  const res = await ApiService.put(`pallet/${pallet.id}`, pallet, {
    headers: {
      Authorization: `Bearer ${Sessions.userToken}`,
    },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const deletePallet = createAsyncThunk("delete-pallet", async (id) => {
  const res = await ApiService.delete(`pallet/${id}`, {
    headers: {
      Authorization: `Bearer ${Sessions.userToken}`,
    },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export default createRack;
