import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "../ApiService/ApiService";

const getAllBanks = createAsyncThunk("/get-banks", async (param) => {
  const res = await ApiService.get(`/bank?${param}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  const params = new URLSearchParams(param);
  const page = params.get("page");
  return page === "0"
    ? { data: res.data, type: "add", status: res.status }
    : { data: res.data, type: "append", status: res.status };
});

export const registerBanks = createAsyncThunk("/register-banks", async (body) => {
  const res = await ApiService.post(
    `/bank`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const updateBanks = createAsyncThunk("/update-banks", async (body) => {
  const res = await ApiService.patch(
    `/bank/${body.id}`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const deleteBanks = createAsyncThunk("delete-bank", async (id) => {
  const res = await ApiService.delete(`bank/${id}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const getAllCodes = createAsyncThunk("/get-codes", async (param) => {
  const res = await ApiService.get(`/code?${param}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  const params = new URLSearchParams(param);
  const page = params.get("page");
  return page === "0"
    ? { data: res.data, type: "add", status: res.status }
    : { data: res.data, type: "append", status: res.status };
});

export const registerCodes = createAsyncThunk("/register-codes", async (body) => {
  const res = await ApiService.post(
    `/code`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const updateCodes = createAsyncThunk("/update-codes", async (body) => {
  const res = await ApiService.patch(
    `/code/${body.id}`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const deleteCodes = createAsyncThunk("delete-code", async (id) => {
  const res = await ApiService.delete(`code/${id}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export default getAllBanks;
