import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "../ApiService/ApiService";

const loanConfigThunk = createAsyncThunk("loan-config/api", async () => {
  const res = await ApiService.get(`loan/config`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});

export const submitLoanFormThunk = createAsyncThunk("loan-form-submit/api", async (data) => {
  const res = await ApiService.post(
    `loan/${data.type}`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});

export const getAllSubmitterLoanFormThunk = createAsyncThunk(
  "loan-form-submit/api",
  async (param) => {
    const res = await ApiService.get(`loan${param ? `?${param}` : ""}`, {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    })
      .then((r) => r)
      .catch((error) => error.response);
    return res;
  }
);

export const updateLeadDataThunk = createAsyncThunk("loan-form-update/api", async (data) => {
  const res = await ApiService.patch(
    `loan/${data.id}`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});

export default loanConfigThunk;
