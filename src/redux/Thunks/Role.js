import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "../ApiService/ApiService";

const RoleListThunk = createAsyncThunk("rolelist/api", async (param) => {
  const res = await ApiService.get(`role${param ? `?${param}` : ""}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const CreateNewRole = createAsyncThunk("role/create", async (body) => {
  const res = await ApiService.post(
    `role`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const UpdateRole = createAsyncThunk("role/update", async (body) => {
  const res = await ApiService.patch(
    `role/${body.id}`,
    { ...body.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const DeleteRole = createAsyncThunk("role/delete", async (id) => {
  const res = await ApiService.delete(`role/${id}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const roleByIdThunk = createAsyncThunk("role-by-id/api", async (id) => {
  const res = await ApiService.get(`role-agreement/${id}/`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});

export const UpdateRoleAgreement = createAsyncThunk("role-agreement/update", async (body) => {
  const res = await ApiService.post(
    `role-agreement`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export default RoleListThunk;
