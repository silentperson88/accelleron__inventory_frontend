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
            [FeatureTags.LOAN_FORM]: process.env.REACT_APP_SETUP_LOAN_FORM === "true",
          }}
        >
          <App />
        </FlagsProvider>
      </MaterialUIControllerProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
