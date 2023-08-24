import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "../ApiService/ApiService";

const createWarehouseThunk = createAsyncThunk("warehouses/create", async (body) => {
  const res = await ApiService.post(
    `warehouses`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const warehouseListThunk = createAsyncThunk("warehouselist/api", async (param) => {
  const res = await ApiService.get(`warehouses${param ? `?${param}` : ""}`, {
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

export const warehouseByIdThunk = createAsyncThunk("warehouses-by-id/api", async (id) => {
  const res = await ApiService.get(`warehouses/${id}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const productByWarehouseIdThunk = createAsyncThunk(
  "warehouses/product-by-warehouse-id/api",
  async (data) => {
    const res = await ApiService.get(
      `warehouses/${data?.id}/equipment${data?.params ? `?${data.params}` : ""}`,
      {
        headers: { Authorization: `Bearer ${Sessions.userToken}` },
      }
    )
      .then((r) => r)
      .catch((err) => err.response);
    const params = new URLSearchParams(data?.params);
    const page = params.get("page");
    return page === "0"
      ? { data: res.data, type: "add", status: res.status }
      : { data: res.data, type: "append", status: res.status };
  }
);

export const warehouseUpdateThunk = createAsyncThunk("warehouses/update", async (body) => {
  const res = await ApiService.patch(
    `warehouses/${body.id}`,
    { ...body.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const warehouseDeleteThunk = createAsyncThunk("warehouses/delete", async (id) => {
  const res = await ApiService.delete(`warehouses/${id}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export default createWarehouseThunk;
