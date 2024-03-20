import { createAsyncThunk } from "@reduxjs/toolkit";
import ApiService from "redux/ApiService/ApiService";

const uploadInventoryFromExcel = createAsyncThunk("upload-invenotory", async (file) => {
  const formData = new FormData();
  formData.append("uploadfile", file);

  console.log("formData", formData);
  const res = await ApiService.post(`inventory/fromexcel`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const getInventory = createAsyncThunk("get-inventory", async (param) => {
  const res = await ApiService.get(`inventory?${param}`)
    .then((r) => r)
    .catch((err) => err.response);

  const params = new URLSearchParams(param);
  const page = params.get("page");
  return page === "0"
    ? { data: res.data, type: "add", status: res.status }
    : { data: res.data, type: "append", status: res.status };
});

export default uploadInventoryFromExcel;
