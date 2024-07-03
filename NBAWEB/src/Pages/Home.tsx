import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from '../Auth/axiosConfig';
import "./Home.css"
import { isTokenExpired, useAuth } from "../Auth/authContext";
import Profile from "./Profile";
//import { ReactComponent as Logo } from "../assets/logos/warriorslogo.svg"

export default function Home(name: any ){
    const sleep = (ms: number | undefined) => new Promise(r => setTimeout(r, ms));
    const [loading, setLoading] = useState(true);
    const {token, team, setTeam} = useAuth();
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
      
    type RouteParams = {
        username: string
    }
      
      const { username } = useParams<RouteParams>();

    const fetchUser = async() =>{
        try{
            const response = await axiosInstance.get(`/home/${username}`);
            console.log("fetchUser - team " + response.data + "      ")
            setTeam(response.data)
            localStorage.setItem('team', response.data)
            await sleep(500)
        } catch(error) {
            console.error(isTokenExpired())
        } finally {
            setLoading(false);
        }
    }

    const selectTeam = async(key: string) =>{
        setLoading(true);
        try{
            console.log(key)
            const response = await axiosInstance.post(`/set_team?team=${key}`)
            setTeam(response.data)
            console.log(response.data)
            localStorage.setItem('team',response.data)
            await sleep(300)
        }
        catch{

        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    if (loading) {
        return "LOADING"
    }
    if (localStorage.getItem('team')) {
        return <Profile team={team}></Profile>
    }
    return(
        <div className="h-teamselect">
            {Object.keys(logos).map((key) => (
                <div className="h-teamlogo">
                    <img src={logos[key]} onClick={(e) => selectTeam(key)}/>
                    {key}
                </div>
            ))}
        </div>
    )
}