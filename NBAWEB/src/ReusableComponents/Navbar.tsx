import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"
import { useAuth } from "../Auth/authContext";
import axiosInstance from "../Auth/axiosConfig";

export default function Navbar () {
    const [user, setUser] = useState("")
    const  {token, logout, isLoggedIn, username, setUsername}  = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const getUsername = async() => {
            try{
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

    const changeTeam = async() => {
        try{
            console.log("Dink donk")
            const response = await axiosInstance.put(`/set_team`)
            window.location.reload();
        }
        catch (error:any) {
            console.log("Something went wrong brodie")
        }
    }

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
                <h2 className="Navbar">{!isLoggedIn ?
                    <Link to={`/signup`}>Register</Link> : <button onClick={() => handleLogout()}>Logout</button>} </h2>
                <h2 className="Navbar">{isLoggedIn ?
                    <button onClick={() => changeTeam()}>Change Team</button>: ""}</h2>
            </div>
        </>
    )
}