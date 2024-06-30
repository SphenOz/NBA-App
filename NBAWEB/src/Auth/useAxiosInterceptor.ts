import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosConfig';
import { useAuth } from './authContext';

const useAxiosInterceptor = () => {
    const navigate = useNavigate();
    const {logout} = useAuth();

    useEffect(() => {
        const interceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.message === 'Token expired' || error.response?.status === 401) {
                    localStorage.removeItem('token'); // Optional: remove the token from storage
                    logout();
                    alert("Session expired, login")
                    navigate('/login'); // Redirect to login page
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.response.eject(interceptor);
        };
    }, [navigate]);
};

export default useAxiosInterceptor;
