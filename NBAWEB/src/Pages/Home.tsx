import React, { useEffect, useState } from "react";
import axios from "axios";
import { Params, useParams } from "react-router-dom";
import axiosInstance from '../Auth/axiosConfig';
import Navbar from "../ReusableComponents/Navbar";
import "./Home.css"
import lakersLogo from "../assets/logos/lakerslogo.svg"
//import { ReactComponent as Logo } from "../assets/logos/warriorslogo.svg"

export default function Home(name: any ){
    const [team, setTeam] = useState("Freeing the Promise Lands")
    const [loading, setLoading] = useState(true);
    const modules = import.meta.glob('../assets/logos/*.svg', {eager:true}) as Record<string, { default: string }>
    type Logos = {
        [key: string]: any;
      };
      
      // Map the imported modules to an object
      const logos: Logos = {};
      
      for (const path in modules) {
        if (modules.hasOwnProperty(path)) {
          const fileName = path.split('/').pop()?.replace('.svg', '');
          if (fileName) {
            logos[fileName] = modules[path].default;
          }
        }
      }
      

    console.log(logos);

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
        <div className="h-teamselect">
            {Object.keys(logos).map((key) => (
                <img src={logos[key]}/>
            ))}
        </div>
    )
}