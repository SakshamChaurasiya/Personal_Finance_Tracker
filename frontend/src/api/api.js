import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7001/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// Transactions
export const getAllTransactions = () => API.get("/transaction");
export const getTransaction = (id) => API.get(`/transaction/${id}`);
export const addTransaction = (data) => API.post("/transaction/add", data);
export const editTransaction = (id, data) => API.patch(`/transaction/${id}/edit`, data);
export const deleteTransaction = (id) => API.delete(`/transaction/${id}/delete`);
