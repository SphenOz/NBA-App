import { jwtDecode } from 'jwt-decode';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the shape of the context state and functions
interface AuthContextType {
    token: string | null;
    isLoggedIn: boolean;
    login: (token: string) => void;
    logout: () => void;
    setToken: (token: string | null) => void;

    username: string | null;
    team: string | null;
    setUsername: (username: string | null) => void;
    setTeam: (team: string | null) => void;
    editTeam: (team: string | null) => void;
    
}
interface DecodedToken {
    exp?: number;
    [key: string]: any; // To accommodate other properties in the token
}



// Create the context with default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps the application and provides the context value
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('token'));
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
    const [team, editTeam] = useState<string | null>(localStorage.getItem('team'));

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp === undefined) {
            throw new Error("Token does not have an expiration time");
        }
        const expirationTime = decoded.exp * 1000;
        localStorage.setItem('tokenExpiration', expirationTime.toString())
        setToken(token);
        setIsLoggedIn(true);
        setUsername(decoded.sub);
    };

    const setTeam = (team: string | null) => {
        if (team === null) {
            localStorage.removeItem('team');
            editTeam(null);
        }
        if (team)
            localStorage.setItem('team', team);
        editTeam(team);
    } 

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username')
        localStorage.removeItem('team')
        setUsername(null)
        setToken(null)
        editTeam(null)
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
        <AuthContext.Provider value={{ token, isLoggedIn, login, logout, setToken, username, setUsername, team, editTeam, setTeam}}>
            {children}
        </AuthContext.Provider>
    );
};
export function isTokenExpired(): boolean {
    const expire = localStorage.getItem('tokenExpiration');
    if (!expire) {
        return true;
    }
    return Date.now() > parseInt(expire, 10);
}
// Custom hook to use the AuthContext in components
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
