import axios from 'axios';
import { isTokenExpired, useAuth } from './auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://10.0.2.2:8000/api/',  // Set the base URL for your API
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    async config => {
        const token = await AsyncStorage.getItem('token');
        console.log("Token: ", token);
        if(token){
            if(await isTokenExpired(token)){
                console.warn("Expired token")
            }
            else{
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
