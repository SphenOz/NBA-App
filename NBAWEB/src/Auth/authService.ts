import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = 'token';
// export const getTokenExpirationDate = (token: string): Date | null => {
//     console.log(token)
//     const formatcheck = token.split('.');
//     if (formatcheck.length !== 3) {
//         throw new Error('Invalid token format')
//     }
//     const decoded: any = jwtDecode(token);
//     if (!decoded.exp) {
//         return null;
//     }
//     const date = new Date(0);
//     date.setUTCSeconds(decoded.exp);
//     return date;
// };

// export const isTokenExpired = (token: string): boolean => {
//     try{
//         const expirationDate = getTokenExpirationDate(token);
//         if (!expirationDate) {
//             return false;
//         }
//         return expirationDate < new Date();
//     }
//     catch(error : any) {
//         console.error('Invalid token:', error.message)
//         return error.message
//     }
// };