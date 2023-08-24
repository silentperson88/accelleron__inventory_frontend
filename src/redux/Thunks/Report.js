import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "../ApiService/ApiService";

const createReportType = createAsyncThunk("create-report-type", async (body) => {
  const res = await ApiService.post(
    `report-types`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const getAllReportTypes = createAsyncThunk("report-types/list", async (param) => {
  const res = await ApiService.get(`report-types?${param}`, {
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

export const getReportTypeById = createAsyncThunk("report-types/get", async (id) => {
  const res = await ApiService.get(`report-types/${id}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const updateReportType = createAsyncThunk("report-types/update", async (body) => {
  const res = await ApiService.patch(
    `report-types/${body.reportTypeId}`,
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

export const createParamter = createAsyncThunk("report-types/create-parameter", async (body) => {
  const res = await ApiService.patch(
    `report-types/${body.reportType}/parameters`,
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

export const updateParamter = createAsyncThunk(
  "report-types/update-parameter-and-figure",
  async (body) => {
    const res = await ApiService.patch(
      `report-types/${body.reportType}/parameters/${body.parameterId}`,
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
  }
);

export const deleteParamter = createAsyncThunk("report-types/delete-parameter", async (body) => {
  const res = await ApiService.delete(
    `report-types/${body.reportType}/parameters/${body.parameterId}`,
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const deleteReportType = createAsyncThunk("report-types/delete", async (id) => {
  const res = await ApiService.delete(`report-types/${id}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const createReport = createAsyncThunk("report/create", async (body) => {
  const res = await ApiService.post(
    `reports`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )

    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const getAllReports = createAsyncThunk("report/list", async (param) => {
  const res = await ApiService.get(`reports?${param}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })

    .then((r) => r)
    .catch((err) => err.response);
  const params = new URLSearchParams(param);
  const page = params.get("page");
  return page === "0"
    ? { data: res.data, type: "add", status: res.status }
    : { data: res.data.data, type: "append", status: res.status };
});

export const getReportById = createAsyncThunk("report/get", async (id) => {
  const res = await ApiService.get(`reports/${id}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const updateReport = createAsyncThunk("report/update", async (body) => {
  const res = await ApiService.patch(
    `reports/${body.reportId}`,
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

export const updateReportStatus = createAsyncThunk("report/update-status", async (body) => {
  const res = await ApiService.patch(
    `reports/${body.reportId}`,
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

export const deleteReport = createAsyncThunk("report/delete", async (id) => {
  const res = await ApiService.delete(`reports/${id}`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((err) => err.response);
  return res;
});

export const exportReportThunk = createAsyncThunk("export-report/api", async (reportId) => {
  const res = await fetch(`${process.env.REACT_APP_BASE_URL}/reports/${reportId}/export`, {
    method: "GET",
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  }).then((response) => response.blob());
  return res;
});

export default createReportType;
