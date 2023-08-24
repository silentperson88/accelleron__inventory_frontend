import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "redux/ApiService/ApiService";

export const loginThunk = createAsyncThunk("login/api", async (body) => {
  const res = await ApiService.post("auths/login", {
    ...body,
  })
    .then((r) => r.data)
    .catch((err) => err.response);
  return res;
});

export const logoutThunk = createAsyncThunk("logout/api", async () => {
  const res = await ApiService.get("auths/logout", {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const ForgetPasswordThunk = createAsyncThunk("forgetpassword/api", async (body) => {
  const res = await ApiService.post(`auths/forget-password`, { ...body })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const ResetPasswordThunk = createAsyncThunk("forgetpassword/api", async (data) => {
  const res = await ApiService.patch(`auths/reset-password/${data.id}`, { ...data.body })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const checkResetTokenThunk = createAsyncThunk("check-reset-token/api", async (token) => {
  const res = await ApiService.get(`auths/reset-password/${token}`)
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

// create dummy thunk for reseting all state
export const resetStateThunk = createAsyncThunk("reset-state/api", async () => "reset");

export default ForgetPasswordThunk;
