import { useState, useEffect } from 'react';
import { isLoggedIn } from './authService';

const useAuth = () => {
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        setAuthenticated(isLoggedIn());
    }, []);

    return authenticated;
};

export default useAuth;
