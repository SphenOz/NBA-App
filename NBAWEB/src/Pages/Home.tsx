import React, { useEffect, useState } from "react";
import axios from "axios";
import { Params, useParams } from "react-router-dom";
import axiosInstance from '../axiosConfig';

export default function Home(name: any ){
    const [team, setTeam] = useState("Freeing the Promise Lands")

    type RouteParams = {
        username: string
      }
      
      const { username } = useParams<RouteParams>();

    const fetchUser = async() =>{
        try{
            const response = await axiosInstance.get(`/home/${username}`);
            setTeam(response.data)
        } catch(error) {
            console.error("Last Rites")
        }
    }

    useEffect(() => {
        fetchUser()
    }, [name])
    return(
        <p>
            {team}
        </p>
    )
}