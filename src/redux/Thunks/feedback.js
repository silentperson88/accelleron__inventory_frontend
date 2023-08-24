import Sessions from "utils/Sessions";
import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiService from "redux/ApiService/ApiService";

const getAllfeedbacks = createAsyncThunk("feedback-listing/api", async (param) => {
  const res = await ApiService.get(`feedback?${param}`, {
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

export const deleterFeedback = createAsyncThunk("delete-feedback/api", async (id) => {
  const res = await ApiService.delete(`safety-cards/${id}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export default getAllfeedbacks;
