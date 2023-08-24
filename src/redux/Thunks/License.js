import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "../ApiService/ApiService";

const licenseListThunk = createAsyncThunk("license-list/api", async () => {
  const res = await ApiService.get(`licences`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});
export const accountLicenseThunk = createAsyncThunk("account-license/api", async () => {
  const res = await ApiService.get(`accounts/licence`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const requestLicenseThunk = createAsyncThunk("request-license/api", async (body) => {
  const res = await ApiService.post(
    `account-licences/request`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  );
  return res.data;
});

export const pendingLicenseThunk = createAsyncThunk("account-licence/api", async () => {
  const res = await ApiService.get(`account-licences/pending-requests?page=0&perPage=10`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});

export const pendingActionThunk = createAsyncThunk("accept-licence/api", async (data) => {
  const res = await ApiService.patch(
    `account-licences/${data.id}/respond`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});

export const accountLicenseByIdThunk = createAsyncThunk("account-license-by-id/api", async (id) => {
  const res = await ApiService.get(`accounts/${id}/licence`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export default licenseListThunk;
