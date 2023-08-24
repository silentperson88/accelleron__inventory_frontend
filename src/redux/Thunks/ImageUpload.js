import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "../ApiService/ApiService";

const uploadImageThunk = createAsyncThunk("files/upload", async ({ file, type }) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  const res = await ApiService.post("files/upload", formData, {
    headers: {
      Authorization: `Bearer ${Sessions.userToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
});
export default uploadImageThunk;
