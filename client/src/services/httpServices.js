import axios from "axios";

console.log("VITE_APP_API_URL =", import.meta.env.VITE_APP_API_URL);

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 500000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("accessToken");
  return {
    ...config,
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    },
  };
});

const responseBody = (response) => response.data;

const requests = {
  get: (url, body) => instance.get(url, body).then(responseBody),
  post: (url, body) => instance.post(url, body).then(responseBody),
  put: (url, body) => instance.put(url, body).then(responseBody),
  delete: (url, body) => instance.delete(url, body).then(responseBody),
};

export default requests;