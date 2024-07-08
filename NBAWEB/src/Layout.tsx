// Layout.tsx
import React from 'react';
import Navbar from './ReusableComponents/Navbar';
import { Outlet } from 'react-router-dom';
import useAxiosInterceptor from './Auth/useAxiosInterceptor';

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    useAxiosInterceptor();
    return (
        <>
            <Navbar />
            <main><Outlet/>{children}</main>
        </>
    );
};

export default Layout;
