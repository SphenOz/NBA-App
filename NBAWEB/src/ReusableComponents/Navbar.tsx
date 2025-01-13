import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"
import { useAuth } from "../Auth/authContext";
import axiosInstance from "../Auth/axiosConfig";
import Select from "react-select";
import { stat } from "fs";

export default function Navbar () {
    const [user, setUser] = useState("")
    const  {team, setTeam, token, logout, isLoggedIn, username}  = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const getUsername = async() => {
            try{
                if(!(token==null)){
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
            setTeam(null)
            navigate('home')
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
    const teamNavi = (input: any) => {
        navigate(`/${input.value}`)
    }

    return(
        <>
            <div className="sidebar">
                <h2 className="Navbar"><Link to={"/playersearch"}>Player_Search </Link></h2>
                {isLoggedIn && team ?
                    <Select className = "Navbar" placeholder="Team-Navigation"
                            options={[
                                {value: 'teamcentral', label: 'Team-View'}, 
                                {value: 'game-logs', label: 'Team-Games'}]}
                        styles={style} onChange={teamNavi}>
                    </Select> : ''}
                <h2 className="Navbar">{!isLoggedIn ?
                    <Link to={`/signup`}>Register</Link> : <button onClick={() => handleLogout()}>Logout</button>} </h2>
                <h2 className="Navbar">{isLoggedIn ?
                    <button onClick={() => changeTeam()}>Change Team</button>: ""}</h2>
            </div>
        </>
    )
}

const style = { control: (baseStyles: any) => ({
    ...baseStyles,
    color: 'white',
    marginBottom: 10,
    backgroundColor: 'rgba(100, 108, 255, 0.78)',
    fontColor: 'white',
    borderColor: 'transparent',
  }),
option: (baseStyles: any, state: { isFocused: any; }) => ({
    ...baseStyles,
    color: 'white',
    backgroundColor: state.isFocused ? 'rgba(126, 195, 255)' : 'grey',
    fontSize: state.isFocused ? 17 : 16,
  }),
input: (baseStyles: any, {}: any) => ({
    ...baseStyles,
    color: 'white',
  }),
placeholder: (baseStyles: any, {}: any) => ({
    ...baseStyles,
    color: 'white',
  }),
menuList(baseStyles: any, props: any) {
    return {
      ...baseStyles,
      backgroundColor: 'rgba(126, 195, 255)',
      border: 'solid 1.5px black',
      padding: 0,
      borderRadius: 5,
      width: 'auto'
    };
},
singleValue: (baseStyles: any, {}: any) => ({
    ...baseStyles,
    color: 'white',
  }),
}