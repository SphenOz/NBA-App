import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = 'token';

export const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const getTokenExpirationDate = (token: string): Date | null => {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) {
        return null;
    }
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
};

export const isTokenExpired = (token: string): boolean => {
    const expirationDate = getTokenExpirationDate(token);
    if (!expirationDate) {
        return false;
    }
    return expirationDate < new Date();
};

export const isLoggedIn = (): boolean => {
    const token = getToken();
    return !!token && !isTokenExpired(token);
};
