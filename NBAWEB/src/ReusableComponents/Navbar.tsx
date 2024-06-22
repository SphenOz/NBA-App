import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../Auth/axiosConfig";
import "./Navbar.css"
import useAuth from "../Auth/useAuth";
import { removeToken } from "../Auth/authService";

export default function Navbar () {
    const [isAuth, setIsAuth] = useState(false);
    const  token  = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const checkToken = () => {
            if(token) {
                console.log("We Found the Token: ", token)
                setIsAuth(true);
            } else {
                console.log("Token Not Found")
            }
        };

        checkToken();
    }, [location, token])

    function logout() {
        removeToken();
        navigate(`/`);
    }

    return(
        <>
            <div className="sidebar">
                <h2><Link to={"/"}>Player_Search </Link></h2>
                <h2>{isAuth ?
                    <Link to={'/home'}>Home</Link> : 'not so cock ass'} </h2>
                <h2>Register </h2>
                <button onClick={() => logout()}></button>
            </div>
        </>
    )
}