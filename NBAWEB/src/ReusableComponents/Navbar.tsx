import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"
import { useAuth } from "../Auth/authContext";
import axiosInstance from "../Auth/axiosConfig";
import useAxiosInterceptor from "../Auth/useAxiosInterceptor";

export default function Navbar () {
    const [user, setUser] = useState("")
    const  {token, logout, isLoggedIn, username, setUsername}  = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("executed")
        const getUsername = async() => {
            try{
                console.log("TOKEN: " + token)
                if(!(token==null)){
                    const name = await axiosInstance.get('/username')
                    setUsername(name.data)
                }
            }
            catch (error:any) {
                console.error('Error grabbing username', error)
                if(error.message == "Token expired"){
                    navigate('/signup')
                }
            }
            
        }
        getUsername()
    }, [token])

    function handleLogout() {
        logout()
        setUser("")
        navigate(`/`);
    }

    return(
        <>
            <div className="sidebar">
                <h2 className="Navbar"><Link to={"/playersearch"}>Player_Search </Link></h2>
                <h2 className="Navbar">{isLoggedIn ?
                    <Link to={`/home/${username}`}>{username}</Link> : 'not so cock ass'} </h2>
                <h2 className="Navbar"><Link to={`/signup`}>Register</Link></h2>
                <button onClick={() => handleLogout()}></button>
            </div>
        </>
    )
}