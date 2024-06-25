import React, { useEffect, useState } from "react";
import axios from "axios";
import { Params, useParams } from "react-router-dom";
import axiosInstance from '../Auth/axiosConfig';
import Navbar from "../ReusableComponents/Navbar";

export default function Home(name: any ){
    const [team, setTeam] = useState("Freeing the Promise Lands")
    const [loading, setLoading] = useState(true);

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
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    if (loading) {
        return "LOADING"
    }
    return(
        <p>
            {team}
        </p>
    )
}