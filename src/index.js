import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "App";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";
import { Provider } from "react-redux";
import Store from "redux/Store/Store";

ReactDOM.render(
  <Provider store={Store}>
    <BrowserRouter>
      <MaterialUIControllerProvider>
        <App />
      </MaterialUIControllerProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
