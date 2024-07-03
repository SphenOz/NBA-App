import React, { useEffect, useState } from "react";
import axiosInstance from "../Auth/axiosConfig";
import "./Profile.css"


interface Props{
   team: string | null
}

const Profile: React.FC<Props> = ({ team }) => {
    const [array, setArray] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPlayers()
        setLoading(false)
    }, [])

 
    const getPlayers = async() => {
        const response = await axiosInstance.get(`/playersOfTeam?team=${team}`)
        setArray(response.data)
        console.log(response.data);
    }
    if(loading){
        return "LOADING";
    }
    if (!array.length || !array[0]) {
        return <div>No player data available</div>;
    }
    return(
        <>
        <div className="p-starplayer">
            <img src={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${array[0][0]}.png`}/>
            {array[0][27]}
            <div className="p-staritem">{(Number(array[0][26])/Number(array[0][6])).toFixed(2)} PPG</div>
            <div className="p-staritem">{(Number(array[0][20])/Number(array[0][6])).toFixed(2)} RPG </div>
            <div className="p-staritem">{(Number(array[0][21])/Number(array[0][6])).toFixed(2)} APG</div>
        </div>
        </>
    )
}

export default Profile