import { useEffect, useState } from "react";
import axiosInstance from '../Auth/axiosConfig';
import "./Home.css"
import { isTokenExpired, useAuth } from "../Auth/authContext";
import { useNavigate } from "react-router-dom";
//import { ReactComponent as Logo } from "../assets/logos/warriorslogo.svg"

export default function Home(name: any ){
    const sleep = (ms: number | undefined) => new Promise(r => setTimeout(r, ms));
    const [loading, setLoading] = useState(true);
    const {token, team, setTeam} = useAuth();
    const navigate = useNavigate();
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
      

    const selectTeam = async(key: string) =>{
        try{
            const response = await axiosInstance.put(`/set_team`,null,{
                params: {
                    team: key
                }
            }
            );
            setTeam(response.data)
            console.log("Set team: ", response.data)
            await sleep(300)
            navigate(`/teamcentral`)
        }
        catch{

        }
        finally{
            setLoading(false);
        }
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