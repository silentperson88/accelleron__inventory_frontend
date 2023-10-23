import { createSlice } from "@reduxjs/toolkit";
import { resetStateThunk } from "redux/Thunks/Authentication";
import Constants, { defaultData } from "utils/Constants";
import loanConfigThunk from "redux/Thunks/LoanFormConfig";

const initialState = {
  loading: "idle",
  refetchConfig: true,
  loanConfig: [],
  screens: [
    {
      name: "Home Loan",
      id: defaultData.HOME_LOAN_SCREEN_ID,
      index: 0,
      screensInfo: {},
    },
    {
      name: "Personal Loan",
      id: defaultData.PERSONAL_LOAN_SCREEN_ID,
      index: 1,
      screensInfo: {},
    },
    {
      name: "Business Loan",
      id: defaultData.BUSINESS_LOAN_SCREEN_ID,
      index: 2,
      screensInfo: {},
    },
    {
      name: "Car Loan",
      id: defaultData.CAR_LOAN_SCREEN_ID,
      index: 3,
      screensInfo: {},
    },
  ],
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {},

  extraReducers: {
    [loanConfigThunk.pending]: (state) => {
      state.loading = Constants.PENDING;
    },
    [loanConfigThunk.fulfilled]: (state, action) => {
      state.loading = Constants.FULFILLED;
      state.loanConfig[0] = action.payload.data;
      action.payload.data.data.screens.forEach((element, sIndex) => {
        const screenIndex = state.screens.findIndex((screen) => screen.id === element.screenId);
        if (screenIndex !== -1) {
          state.screens[screenIndex].index = sIndex;
          state.screens[screenIndex].screensInfo = element;
        }
      });
      state.refetchConfig = false;
    },
    [loanConfigThunk.rejected]: (state) => {
      state.loading = Constants.REJECTED;
    },
    [resetStateThunk.fulfilled]: (state) => {
      state.loading = Constants.IDLE;
      state.equipmentLoading = Constants.IDLE;
      state.refetchConfig = true;
      state.config = [];
      state.screens = initialState.screens;
    },
  },
});

export default configSlice.reducer;
