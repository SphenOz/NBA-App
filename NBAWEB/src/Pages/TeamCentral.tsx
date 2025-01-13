import React, { Key, useEffect, useState } from "react";
import axiosInstance from "../Auth/axiosConfig";
import "./TeamCentral.css"
import Strip from "../ReusableComponents/LineupDisplay";
import { useAuth } from "../Auth/authContext";
import { useNavigate } from "react-router-dom";

export default function TeamCentral () {
    const [array, setArray] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ftPlayer, setftPlayer] = useState();
    const [ftPlayerStats, setftPlayerStats] = useState([]);
    const { team } = useAuth();
    const navigate = useNavigate()
    useEffect(() => {
        if(team){
            getPlayers()
        }
        else{
            navigate('/home')
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        if(ftPlayer && array){
            console.log(ftPlayer)
            for(let i = 0; i < array.length; i++){
                if(array[i][0] == ftPlayer){
                    setftPlayerStats(array[i][1])
                    console.log(array[i][1])
                }
            }
        }
    }, [ftPlayer])

 
    const getPlayers = async() => {
        const response = await axiosInstance.get(`/playersOfTeam`, {
            params: {
                teamToSearch: team
            }
        })
        setArray(response.data)
        setftPlayer(response.data[0][0])
        console.log(response.data);
    }
    if(loading){
        return "LOADING";
    }
    if (!array.length || !array[1]) {
        return "LOADING";
    }
    return(
        <div className="profile-container">
            <div className="p-featured"> 
                {/* Player Array Defined as array[Player_Index][Player Name, Player Stats[0-27]] */}
                <div className="p-starimg">
                    <span className="p-f_name">{ftPlayer}</span><br></br><img src={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${ftPlayerStats[0]}.png`}/>
                </div>
                <div className="p-featureditems">
                    <div className="p-f_item"><h3 className="p-h3">PPG</h3>{(Number(ftPlayerStats[26])/Number(ftPlayerStats[6])).toFixed(2)}</div>
                    <div className="p-f_item"><h3 className="p-h3">RPG</h3>{(Number(ftPlayerStats[20])/Number(ftPlayerStats[6])).toFixed(2)}</div>
                    <div className="p-f_item"><h3 className="p-h3">APG</h3>{(Number(ftPlayerStats[21])/Number(ftPlayerStats[6])).toFixed(2)}</div>
                    <div className="p-f_item"><h3 className="p-h3">FG%</h3>{(Number(ftPlayerStats[11])*100).toFixed(1)}%</div>
                    <div className="p-f_item"><h3 className="p-h3">3FG%</h3>{(Number(ftPlayerStats[14])*100).toFixed(1)}%</div>
                    <div className="p-f_item"><h3 className="p-h3">FT%</h3>{(Number(ftPlayerStats[17])*100).toFixed(1)}%</div>
                </div>
            </div>
            <div className="p-teamlist">
                <Strip player={array} setPlayer={setftPlayer} />
            </div>
                {/* {array.map((player: any, season: Key) => (
                    player[0]
                ))} */}
        </div>
    )
}
