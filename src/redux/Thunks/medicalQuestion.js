import Sessions from "utils/Sessions";
import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiService from "redux/ApiService/ApiService";

const getAllQuestions = createAsyncThunk("questions-listing/api", async (param) => {
  const res = await ApiService.get(`question?${param}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  const params = new URLSearchParams(param);
  const page = params.get("page");
  return page === "0" ? { data: res.data, type: "add" } : { data: res.data, type: "append" };
});

export const createMedicalQuestion = createAsyncThunk("create-medical-question", async (body) => {
  const res = await ApiService.post(
    `question`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const updateMedicalQuestion = createAsyncThunk("medical-question/update", async (body) => {
  const res = await ApiService.patch(
    `question/${body.medicalQuestionId}`,
    {
      ...body.body,
    },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const deleteMedicalQuestion = createAsyncThunk("medical-question/delete", async (id) => {
  const res = await ApiService.delete(`question/${id}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});
export default getAllQuestions;
