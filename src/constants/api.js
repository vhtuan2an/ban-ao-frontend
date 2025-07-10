// src/api/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/'; // Điều chỉnh URL API

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
