/* eslint-disable  */

import axios from "axios";
import Sessions from "utils/Sessions";

// Axios API Service
const ReynardBackendApiService = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

ReynardBackendApiService.interceptors.request.use((config) => {
  const isSuperAdminViewingAdminPanel = Sessions.isSuperAdminViewingAdminPanel;
  if (isSuperAdminViewingAdminPanel) {
    const account = localStorage.getItem("account");
    const admin = localStorage.getItem("admin");

    if (["get", "delete"].includes(config.method)) {
      config.params = {
        ...config.params,
        ...{ account: account },
        ...{ admin: admin },
      };
    } else if (["post", "put", "patch"].includes(config.method)) {
      if (config.data instanceof FormData) {
        config.data.append("account", account);
        config.data.append("admin", admin);
      } else {
        config.data = {
          ...config.data,
          ...{ account: account },
          ...{ admin: admin },
        };
      }
    }
  }
  return config;
});

export const RandomApiService = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${Sessions.userToken}`,
  },
});

// Fetch API Service
export const fetchReynardBackendApi = async (endpoint, options = {}) => {
  const baseURL = process.env.REACT_APP_BASE_URL;

  const url = new URL(endpoint, baseURL);

  const defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${Sessions.userToken}`,
  };

  const requestOptions = {
    method: options.method || "GET",
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return response;
  } catch (error) {
    throw error;
  }
};

export default ReynardBackendApiService;
