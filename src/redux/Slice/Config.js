import { createSlice } from "@reduxjs/toolkit";
import { resetStateThunk } from "redux/Thunks/Authentication";
import configThunk, { equipmentConfig } from "redux/Thunks/Config";
import { defaultData } from "utils/Constants";

const initialState = {
  loading: "idle",
  equipmentLoading: "idle",
  refetchConfig: true,
  config: [],
  equipmentConfig: [],
  screens: [
    {
      name: "Safe Card",
      id: defaultData.SAFE_CARD_SCREEN_ID,
      index: 0,
      screensInfo: {},
    },
    {
      name: "Unsafe Card",
      id: defaultData.UNSAFE_CARD_SCREEN_ID,
      index: 1,
      screensInfo: {},
    },
    {
      name: "NCR Card",
      id: defaultData.NCR_CARD_SCREEN_ID,
      index: 2,
      screensInfo: {},
    },
    {
      name: "Incident Card",
      id: defaultData.INCIDENT_CARD_SCREEN_ID,
      index: 3,
      screensInfo: {},
    },
    {
      name: "Submit Feedback",
      id: defaultData.FEEDBACK_SCREEN_ID,
      index: 4,
      screensInfo: {},
    },
    {
      name: "Open Shift",
      id: defaultData.SHIFT_SCREEN_ID,
      index: 5,
      screensInfo: {},
    },
    {
      name: "Report",
      id: defaultData.REPORT_SCREEN_ID,
      index: 6,
      screensInfo: {},
    },
    {
      name: "Shift Activity",
      id: defaultData.SHIFT_ACTIVITY_SCREEN_ID,
      index: 7,
      screensInfo: {},
    },
    {
      name: "Equipment",
      id: defaultData.EQUIPMENT_SCREEN_ID,
      index: 8,
      screensInfo: {},
    },
    {
      name: "Warehouse",
      id: defaultData.WAREHOUSE_SCREEN_ID,
      index: 9,
      screensInfo: {},
    },
  ],
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {},

  extraReducers: {
    [configThunk.pending]: (state) => {
      state.loading = "pending";
    },
    [configThunk.fulfilled]: (state, action) => {
      state.loading = "fulfilled";
      state.config[0] = action.payload.data;
      action.payload.data.screens.forEach((element, sIndex) => {
        const screenIndex = state.screens.findIndex((screen) => screen.id === element.screenId);
        if (screenIndex !== -1) {
          state.screens[screenIndex].index = sIndex;
          state.screens[screenIndex].screensInfo = element;
        }
      });
      state.refetchConfig = false;
    },
    [configThunk.rejected]: (state) => {
      state.loading = "rejected";
    },
    [equipmentConfig.pending]: (state) => {
      state.equipmentLoading = "pending";
    },
    [equipmentConfig.fulfilled]: (state, action) => {
      state.equipmentLoading = "fulfilled";
      state.equipmentConfig = action.payload?.data?.equipmentScreen;
      const equipmentIndex = state.screens.findIndex(
        (screen) => screen.id === defaultData.EQUIPMENT_SCREEN_ID
      );
      state.screens[equipmentIndex].screensInfo = action.payload?.data?.equipmentScreen;
    },
    [equipmentConfig.rejected]: (state) => {
      state.equipmentLoading = "rejected";
    },
    [resetStateThunk.fulfilled]: (state) => {
      state.loading = "idle";
      state.equipmentLoading = "idle";
      state.refetchConfig = true;
      state.config = [];
      state.screens = initialState.screens;
    },
  },
});

export default configSlice.reducer;
