import axios from 'axios';
import { useAuth } from './auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://10.0.2.2:8080/api/',  // Set the base URL for your API
});


// Add a request interceptor
axiosInstance.interceptors.request.use(
    async config => {
        const token = AsyncStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
