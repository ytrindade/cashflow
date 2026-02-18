import axios from "axios";
import { getAuthToken } from './authSession';

const api = axios.create({
    baseURL: '/'   
});

api.interceptors.request.use((config) => {
    const token = getAuthToken();

    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
