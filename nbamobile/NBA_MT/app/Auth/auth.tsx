import * as React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReactNode, useContext, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

interface AuthContextType {
    token: string | null;
    isLoggedIn: boolean;
    team: string;
    login: (token: string) => void;
    logout: () => void;
    setTeam: (team: string) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>("")
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!AsyncStorage.getItem('token'));
    const [team, setTeam] = useState<string>("")

    const getAuthState = async () => {
        try{
            const authToken = await AsyncStorage.getItem("token")
            setToken(authToken)
        } catch (error) {
            setToken(null)
        }
    }
    const login = async (token: string) => {
        try{
            await AsyncStorage.setItem('token', token);
            setToken(token);
            setIsLoggedIn(true);
            console.log("Token STORED")
        } catch(error) {
            console.log("Token failed to be stored")
        }
    };
    const logout = async() => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('team')
        setToken(null)
        console.log(token, "Removed")
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{token, isLoggedIn, login, team, setTeam, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
export const isTokenExpired = async (token: string) => {
    try {
        const { exp } = jwtDecode(token);
        if (!exp) return true;
        // Check if the token is expired
        const now = Date.now().valueOf() / 1000; // convert to seconds
        return exp < now;
      } catch (error) {
        console.error("Error decoding token", error);
        return true; // Assume expired if there's an error
      }
}