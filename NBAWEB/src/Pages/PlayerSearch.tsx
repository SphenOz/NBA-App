import { useState, useEffect } from 'react'
import axios from 'axios'
import { Outlet, Link } from "react-router-dom";
import Table from '../Table'

export default function SearchPage() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([]);
  const [inputs, setInputs] = useState([]);
  const [pname, setPname] = useState("")
  

  const fetchAPI = async (pname: string, season: number) => {
    const response = await axios.get(`http://localhost:8080/api/stats?name=${pname}&season=${season}`)
    console.log(response.data)
    setArray(response.data)
  }
  useEffect(() => {
    fetchAPI("seth curry", 21)
  },[])
  const handleSubmit = (event: any) => {
    event.preventDefault();
    fetchAPI(pname, count)
  }
  

  return (
    <>
      <div>
      </div>
      <h1><Link to={`signup`}> TINGS </Link></h1>
      <div className="table">
        <form onSubmit={handleSubmit}>
          <label> Enter a player:  
            <input type="text"
              value={pname}
              onChange={(e) => setPname(e.target.value)} 
            />
          </label>
        <input type="submit" />
        </form>
        <Table player={array}></Table>
      </div>
    </>
  )
}