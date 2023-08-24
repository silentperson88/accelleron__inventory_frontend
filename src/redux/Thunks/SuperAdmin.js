import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "../ApiService/ApiService";

const AdminListThunk = createAsyncThunk("adminlist/api", async (param) => {
  const res = await ApiService.get(`accounts?${param}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  const params = new URLSearchParams(param);
  const page = params.get("page");
  return page === "0"
    ? { data: res.data.data, type: "add" }
    : { data: res.data.data, type: "append" };
});

export const CreateClientThunk = createAsyncThunk("new-client/api", async (body) => {
  const res = await ApiService.post(
    `accounts`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const adminUserThunk = createAsyncThunk("adminuserlist/api", async (id) => {
  const res = await ApiService.get(`users/${id}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const updateAdminProfileThunk = createAsyncThunk("user/update", async (body) => {
  const res = await ApiService.patch(
    `users/${body.id}`,
    { ...body.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export default AdminListThunk;
