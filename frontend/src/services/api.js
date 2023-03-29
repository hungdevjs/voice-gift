import axios from 'axios';

import environments from '../utils/environments';

const { BACKEND_URL } = environments;

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiUpload = axios.create({
  baseURL: BACKEND_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

[api, apiUpload].map((item) =>
  item.interceptors.request.use(
    (config) => {
      // custom request here
      return config;
    },
    (error) => Promise.reject(error)
  )
);

export { api, apiUpload };
