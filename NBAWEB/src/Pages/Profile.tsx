import React, { Key, useEffect, useState } from "react";
import axiosInstance from "../Auth/axiosConfig";
import "./Profile.css"
import Strip from "../ReusableComponents/LineupDisplay";


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
    if (!array.length || !array[1]) {
        return "LOADING";
    }
    return(
        <div className="profile-container">
            <div className="p-featured"> 
                {/* Player Array Defined as array[Player_Index][Player Name, Player Stats[0-27]] */}
                <div className="p-starimg">
                    <span className="p-f_name">{array[0][0]}</span><br></br><img src={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${array[0][1][0]}.png`}/>
                </div>
                <div className="p-featureditems">
                    <div className="p-f_item"><h3 className="p-h3">PPG</h3>{(Number(array[0][1][26])/Number(array[0][1][6])).toFixed(2)}</div>
                    <div className="p-f_item"><h3 className="p-h3">RPG</h3>{(Number(array[0][1][20])/Number(array[0][1][6])).toFixed(2)}</div>
                    <div className="p-f_item"><h3 className="p-h3">APG</h3>{(Number(array[0][1][21])/Number(array[0][1][6])).toFixed(2)}</div>
                    <div className="p-f_item"><h3 className="p-h3">FG%</h3>{(Number(array[0][1][11])*100).toFixed(1)}%</div>
                    <div className="p-f_item"><h3 className="p-h3">3FG%</h3>{(Number(array[0][1][14])*100).toFixed(1)}%</div>
                    <div className="p-f_item"><h3 className="p-h3">FT%</h3>{(Number(array[0][1][17])*100).toFixed(1)}%</div>
                </div>
            </div>
            <div className="p-teamlist">
                <Strip player={array}/>
            </div>
                {/* {array.map((player: any, season: Key) => (
                    player[0]
                ))} */}
        </div>
    )
}

export default Profile