import { createAsyncThunk } from "@reduxjs/toolkit";
import Sessions from "utils/Sessions";
import ApiService from "../ApiService/ApiService";

const payBill = createAsyncThunk("oaybill", async (body) => {
  const res = await ApiService.post(
    `paysprint/bill-payment`,
    { ...body },
    {
      headers: { Authorization: `Bearer ${Sessions.userToken}` },
    }
  )
    .then((r) => r)
    .catch((error) => error.response);
  return res;
});

export default payBill;
