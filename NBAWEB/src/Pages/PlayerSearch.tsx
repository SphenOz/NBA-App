import { useEffect, useState } from 'react'
import axios, { all } from 'axios'
import { Link, useNavigate } from "react-router-dom";
import Table from '../ReusableComponents/Table'
import './Playersearch.css'
import axiosInstance from '../Auth/axiosConfig';
import Select, { OptionsOrGroups } from 'react-select';

export default function SearchPage() {
  const [array, setArray] = useState([]);
  const [pname, setPname] = useState("")
  const [playerNames, setPlayerNames] = useState([])
  const [allnames, setAllNames] = useState<any>([])
  const columns = [
    "Season",                
    "Team",                
    "GP",
    "MPG",       
    "PPG",       
    "APG",      
    "RPG",    
    "FGM",       
    "FGA",
    "FG%", 
    "3PM", 
    "3PA", 
    "3P%", 
    "FTM",       
    "FTA",  
    "FT%", 
    "SPG",        
    "BPG",        
    "TOV",     
    "Fouls",          
]

  
  useEffect(() => {
    fetchPlayers()
    }, [])
  
  useEffect(() => {
    const b = playerNames.map((name: any) => ({value: name, label: name}))
    setAllNames(b);
  }, [playerNames])


  const fetchPlayers = async () => {
    const response = await axiosInstance.get(`player_names`)
    setPlayerNames(response.data)
  }
  const fetchAPI = async (pname: string) => {
    try{
      const response = await axiosInstance.get(`career`,
        {
          params: {
            playername: pname
          }
        }
      )
      setArray(response.data)
    }
    catch (error: any) {
      console.log("expected behavior")
      if(error == "Token Expired"){
        console.log(error)
        const nav = useNavigate()
        nav(`/signup`)
      }
    }finally{
    }
  }
  const handleSubmit = (allnames: any) => {
    // {event.preventDefault();}
    fetchAPI(allnames.value)
  }
  

  return (
    <>
    <div className='player-search-container'>
      <div className='player-search'>
        <h2>Search: </h2>
        <Select onChange={handleSubmit} options={allnames}
        styles={{ control: (baseStyles) => ({
          ...baseStyles,
          color: 'black',
        }),
        option: (baseStyles, {}) => ({
          ...baseStyles,
          color: 'black',
        }
      )}}>
        </Select>
      </div>
      <div className='player-profile' style={{border: "5px solid azure", borderRadius: "10px"}}>
        <div className='player-image'>
          <img style={{border: "3px solid black", padding: '1px'}} width={325} height={238} src={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${array.at(-1)}.png`}></img>
        </div>
        <div className='player-stats'>
          <div className='player-stats-item'>
            <h3>PPG</h3>
            <span>{array && array.length > 1 ? array[array.length-2][4] : 'missing'}</span>
          </div>
          <div className='player-stats-item'>
            <h3>RPG</h3>
            <span>{array && array.length > 1 ? array[array.length-2][6] : 'missing'}</span>
          </div>
          <div className='player-stats-item'>
            <h3>APG</h3>
            <span>{array && array.length > 1 ? array[array.length-2][5] : 'missing'}</span>
          </div>
          <div className='player-stats-item'>
            <h3>FG%</h3>
            <span>{array && array.length > 1 ? array[array.length-2][9] + '%' : 'missing'}</span>
          </div>
          <div className='player-stats-item'>
            <h3>3FG%</h3>
            <span>{array && array.length > 1 ? array[array.length-2][12] + '%': 'missing'}</span>
          </div>
          <div className='player-stats-item'>
            <h3>FT%</h3>
            <span>{array && array.length > 1 ? array[array.length-2][15] + '%': 'missing'}</span>
          </div>
        </div>
      </div>
      <div className='table-container'>
        <div className="table">
          
        </div>
        <Table rows={array.slice(0,-1)} columns = {columns}></Table>
      </div>
    </div>
    </>
  )
}