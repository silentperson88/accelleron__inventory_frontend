import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "../ApiService/ApiService";

const certificateActionThunk = createAsyncThunk("certificate-action/api", async (data) => {
  const res = await ApiService.patch(
    `user-certificate/${data.id}/${data.key}/${data.certificateID}`,
    { ...data.status },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});

export const passportActionThunk = createAsyncThunk("passport-action/api", async (data) => {
  const res = await ApiService.patch(
    `contractual-detail/${data.id}/files/${data.certificateID}`,
    { ...data.status },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});
export default certificateActionThunk;
