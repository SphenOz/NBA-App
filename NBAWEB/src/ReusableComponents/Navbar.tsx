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
    const [schedule, setSchedule] = useState<any>([])
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

    useEffect(() => {
        let isMounted = true
        const fetchSchedule = async () => {
            if (!isMounted) return; // Stop if component unmounted

            try {
                await get_schedule();
            } catch (error) {
                console.error("Something went wrong brodie");
            }

            if (isMounted) {
                setTimeout(fetchSchedule, 10000); // Schedule the next call
            }
        };

        fetchSchedule(); // Start the loop

        return () => {
            isMounted = false; // Prevent further execution after unmount
        };
    }, []);

    const get_schedule = async() => {
            try{
                const response = await axiosInstance.get(`scheduled_games`)
                console.log(response.data)
                setSchedule(response.data)
            }
            catch (error:any) {
                console.log("Something went wrong brodie")
            }
    }

    const changeTeam = async() => {
        try{
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
                <span>{schedule.length > 0 ?
                    <div style={{display: 'flex', flexDirection: 'row', backgroundColor: 'rgba(100, 108, 255, 0.29)', overflowX: 'auto', width: '1000px'}}> 
                        {schedule[0].map((game: any, key: any) => (
                        <div className="Game-Status">
                            {/* <span key={key} className="Navbar">{game.LIVE_STATUS.QUARTER} {game.LIVE_STATUS.GAME_CLOCK} </span> */}
                            <span key={key} className="">{game.START_TIME != "Final" && game.LIVE_TIME? ` ${game.LIVE_TIME}` : game.START_TIME}</span>
                            <span className="">{Object.keys(game.TEAMS)[1]} {game.TEAMS[Object.keys(game.TEAMS)[1]]["SCORE"] ? game.TEAMS[Object.keys(game.TEAMS)[1]]["SCORE"] : ""}</span>
                            <span className="">{Object.keys(game.TEAMS)[0]} {game.TEAMS[Object.keys(game.TEAMS)[0]]["SCORE"] ? game.TEAMS[Object.keys(game.TEAMS)[0]]["SCORE"] : ""}</span>
                        </div>
                        ))}
                    </div>
                    
                : '  ' }</span>
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