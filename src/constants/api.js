// src/api/api.js
import axios from 'axios';

const BASE_URL = 'https://ban-ao-backend.onrender.com/'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
