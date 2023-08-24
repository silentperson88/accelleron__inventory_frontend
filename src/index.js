/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "App";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";
import { Provider } from "react-redux";
import Store from "redux/Store/Store";
import { FlagsProvider } from "flagged";
import { FeatureTags } from "utils/Constants";

ReactDOM.render(
  <Provider store={Store}>
    <BrowserRouter>
      <MaterialUIControllerProvider>
        <FlagsProvider
          features={{
            [FeatureTags.SHIFT_DETAILS]: process.env.REACT_APP_DAL_FF === "true",
            [FeatureTags.SETUP_REPORT]: process.env.REACT_APP_SETUP_REPORT === "true",
            [FeatureTags.ROLE_MANAGEMENT]: process.env.REACT_APP_ROLE_MANAGEMENT === "true",
            [FeatureTags.SETUP_EQUIPMENT]: process.env.REACT_APP_SETUP_EQUIPMENT === "true",
            [FeatureTags.WAREHOUSE]: process.env.REACT_APP_SETUP_WAREHOUSE === "true",
          }}
        >
          <App />
        </FlagsProvider>
      </MaterialUIControllerProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
