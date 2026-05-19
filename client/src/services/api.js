import axios from "axios";

const API = axios.create({
  baseURL:
  "https://taskflow-management-system-production.up.railway.app/api",
});

export default API;