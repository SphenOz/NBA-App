import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the shape of the context state and functions
interface AuthContextType {
    token: string | null;
    username: string | null;
    isLoggedIn: boolean;
    login: (token: string) => void;
    logout: () => void;
    setToken: (token: string | null) => void;
    setUsername: (username: string | null) => void;
}

// Create the context with default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps the application and provides the context value
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('token'));
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

    const login = (token: string) => {
        localStorage.setItem('token', token);
        setToken(token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username')
        setUsername(null)
        setToken(null)
        console.log(token, "Removed")
        setIsLoggedIn(false);
    };

    // Sync the token state with localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, isLoggedIn, login, logout, setToken, username, setUsername}}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext in components
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
