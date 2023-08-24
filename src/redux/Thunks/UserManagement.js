import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "../ApiService/ApiService";

const UserListThunk = createAsyncThunk("userlist/api", async (param) => {
  const res = await ApiService.get(`users${param ? `?${param}` : ""}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const UserListbyIdThunk = createAsyncThunk("userlist/api", async (id) => {
  const res = await ApiService.get(`users/${id}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const DeactivateUserThunk = createAsyncThunk("deactivate/api", async (body) => {
  const res = await ApiService.patch(
    `users/change-status`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res;
});

export const CreateNewUser = createAsyncThunk("user/create", async (body) => {
  const res = await ApiService.post(
    `users`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const updateSyncupTime = createAsyncThunk("user/updateSyncupTime", async (paramAndBody) => {
  const res = await ApiService.patch(
    `accounts/${paramAndBody.accountId}`,
    { ...paramAndBody.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )

    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export default UserListThunk;
