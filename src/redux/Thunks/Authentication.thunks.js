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
  const res = await ApiService.post(`auths/forget-password`, { ...body });
  return res.data;
});

export const ResetPasswordThunk = createAsyncThunk("forgetpassword/api", async (data) => {
  const res = await ApiService.patch(`auths/reset-password/${data.id}`, { ...data.body });
  return res.data;
});

export const checkResetTokenThunk = createAsyncThunk("check-reset-token/api", async (data) => {
  const res = await ApiService.get(`auths/check-reset-token/${data.token}`);
  return res.data;
});

export default ForgetPasswordThunk;
