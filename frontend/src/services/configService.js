/**
 * configService – Axios wrapper for AlgoConfig REST API.
 * Base URL reads from REACT_APP_API_URL env var (falls back to proxy).
 */
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || '';

const http = axios.create({
  baseURL: `${BASE_URL}/configs`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
});

export const getConfigs    = ()           => http.get('/');
export const getConfigById = (id)         => http.get(`/${id}`);
export const postConfig    = (payload)    => http.post('/', payload);
export const putConfig     = (id, payload) => http.put(`/${id}`, payload);
