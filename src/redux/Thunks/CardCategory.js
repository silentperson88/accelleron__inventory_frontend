import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "../ApiService/ApiService";

const getAllCategories = createAsyncThunk("category/list", async (params) => {
  const res = await ApiService.get(`categories?${params}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});
export const CreateNewCard = createAsyncThunk("category/create", async (body) => {
  const res = await ApiService.post(
    `categories`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const updateCategoryCardThunk = createAsyncThunk("category/update", async (body) => {
  const res = await ApiService.patch(
    `categories/${body.id}`,
    { ...body.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const deleteCardThunk = createAsyncThunk("deletecards/api", async (id) => {
  const res = await ApiService.delete(`categories/${id}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export default getAllCategories;
