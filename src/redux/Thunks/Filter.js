import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "redux/ApiService/ApiService";

const filterThunk = createAsyncThunk("filter-safetycards/api", async (param) => {
  const res = await ApiService.get(`safety-cards?${param}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const exportSafetyCardThunk = createAsyncThunk("export/api", async (data) => {
  const res = await fetch(`${process.env.REACT_APP_BASE_URL}/safety-cards/export?${data}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  }).then((response) => response.blob());
  return res;
});

export const projectListThunk = createAsyncThunk("project/api", async () => {
  const res = await ApiService.get(`projects`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const locationListThunk = createAsyncThunk("location/api", async () => {
  const res = await ApiService.get(`/locations`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const severityListThunk = createAsyncThunk("severity/api", async () => {
  const res = await ApiService.get(`severities`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const likelihoodThunk = createAsyncThunk("likelihood/api", async () => {
  const res = await ApiService.get(`likelihoods`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const exportThunk = createAsyncThunk("export/api", async () => {
  const res = await ApiService.get(`/safety-card/export`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res;
});

export const dalShitFiltersThunk = createAsyncThunk("dal-shift-filter/api", async (param) => {
  const res = await ApiService.get(`shifts?${param}`, {
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

export default filterThunk;
