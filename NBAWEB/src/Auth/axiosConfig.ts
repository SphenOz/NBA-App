import axios from 'axios';
import { isTokenExpired, useAuth } from './authContext';
import { Navigate, useNavigate } from 'react-router-dom';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',  // Set the base URL for your API
});


// Add a request interceptor
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            if (isTokenExpired()){
                return Promise.reject(new Error("Token expired"));
            }
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
