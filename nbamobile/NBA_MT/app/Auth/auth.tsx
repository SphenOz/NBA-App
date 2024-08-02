import * as React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReactNode, useContext, useState } from 'react';

interface AuthContextType {
    token: string | null;
    isLoggedIn: boolean;
    team: string;
    login: (token: string) => void;
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

    return (
        <AuthContext.Provider value={{token, isLoggedIn, login, team, setTeam}}>
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