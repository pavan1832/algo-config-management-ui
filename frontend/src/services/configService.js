/**
 * configService – Axios wrapper for AlgoConfig REST API.
 */
import axios from 'axios';

const BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:4000';

const http = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
});

export const getConfigs     = ()              => http.get('/configs');
export const getConfigById  = (id)            => http.get(`/configs/${id}`);
export const postConfig     = (payload)       => http.post('/configs', payload);
export const putConfig      = (id, payload)   => http.put(`/configs/${id}`, payload);
