import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchReynardBackendApi } from "redux/ApiService/ApiService";

// Export Equipment Import Sample File
const exportImportSampleFileThunk = createAsyncThunk(
  "export-equipment-import-sample-file/api",
  async (fileName) => {
    const res = await fetchReynardBackendApi(`/api/files/download-excel/${fileName}`, {
      method: "GET",
    }).then((response) => response.blob());
    return res;
  }
);

export default exportImportSampleFileThunk;
