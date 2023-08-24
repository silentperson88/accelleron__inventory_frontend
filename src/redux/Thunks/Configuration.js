import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "redux/ApiService/ApiService";

const createFieldThunk = createAsyncThunk("createquestion/api", async (body) => {
  const res = await ApiService.post(
    "form-builders",
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r.data)
    .catch((err) => err.response);
  return res;
});

export const updateFieldThunk = createAsyncThunk("updateSort/api", async (body) => {
  const res = await ApiService.patch(
    `form-builders/${body.sortID}`,
    { ...body.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r.data)
    .catch((err) => err.response);
  return res;
});
// pending
export const getAllFieldsThunk = createAsyncThunk("getallfields/api", async (cardType) => {
  const res = await ApiService.get(`form-builders/${cardType}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const deleteFieldsThunk = createAsyncThunk("deletefields/api", async (id) => {
  const res = await ApiService.delete(`form-builders/${id}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export default createFieldThunk;
