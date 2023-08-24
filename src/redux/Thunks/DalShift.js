import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "redux/ApiService/ApiService";

const shiftListThunk = createAsyncThunk("shift-list/api", async () => {
  const res = await ApiService.get("shifts", {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  });
  return res.data;
});

export const createShiftThunk = createAsyncThunk("create-shift/api", async (body) => {
  const res = await ApiService.post(
    "shifts",
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});

export const shiftByIdThunk = createAsyncThunk("shift-by-id/api", async (id) => {
  const res = await ApiService.get(`shifts/${id}/single-shift`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});

export const deleteShiftThunk = createAsyncThunk("shift-delete/api", async (id) => {
  const res = await ApiService.delete(`shifts/${id}/`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});

export const updateShiftThunk = createAsyncThunk("shift-update/api", async (data) => {
  const res = await ApiService.patch(
    `shifts/${data.shiftId}/`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});

export const createShiftMemberThunk = createAsyncThunk("create-shift-member/api", async (body) => {
  const res = await ApiService.post(
    "team-members",
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});

export const deleteTeamMemberThunk = createAsyncThunk("shift-delete/api", async (id) => {
  const res = await ApiService.delete(`team-members/${id}/`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});

export const updateShiftMemberThunk = createAsyncThunk("shift-update/api", async (data) => {
  const res = await ApiService.patch(
    `team-members/${data.memberId}`,
    { ...data.body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});

export const createShiftActivityThunk = createAsyncThunk(
  "create-shift-activity/api",
  async (body) => {
    const res = await ApiService.post(
      "shifts/activities",
      { ...body },
      {
        headers: { Authorization: `Bearer ${Sessions.userToken}` },
      }
    )
      .then((r) => r)
      .catch((error) => error.response);
    return res;
  }
);

export const shiftActivityListThunk = createAsyncThunk(
  "shift-activities-list/api",
  async (shiftId) => {
    const res = await ApiService.get(`shifts//${shiftId}/activities`, {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    })
      .then((r) => r)
      .catch((error) => error.response);
    return res;
  }
);

export const deleteShifActivityThunk = createAsyncThunk("shift-activity-delete/api", async (id) => {
  const res = await ApiService.delete(`shifts/activities/${id}/`, {
    headers: { Authorization: `Bearer ${Sessions.userToken}` },
  })
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});

export const updateShiftActivityThunk = createAsyncThunk(
  "shift-activity-update/api",
  async (data) => {
    const res = await ApiService.patch(
      `shifts/activities/${data.actvityId}`,
      { ...data.body },
      { headers: { Authorization: `Bearer ${Sessions.userToken}` } }
    )
      .then((r) => r)
      .catch((error) => error.response);
    return res;
  }
);

export default shiftListThunk;
