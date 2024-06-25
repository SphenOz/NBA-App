import { useState } from 'react'
import axios from 'axios'
import { Link } from "react-router-dom";
import Table from '../ReusableComponents/Table'
import './Playersearch.css'

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
  const handleSubmit = (event: any) => {
    event.preventDefault();
    fetchAPI(pname, count)
  }
  

  return (
    <>
      <div className='table-container'>
        <h1><Link to={`signup`}> TINGS </Link></h1>
        <div className="table">
          <form onSubmit={handleSubmit} className='ps-form'>
            <label>
              <input type="text"
                className='ps-input'
                placeholder='Enter a player name'
                value={pname}
                onChange={(e) => setPname(e.target.value)} 
              />
            </label>
          </form>
        </div>
        <Table player={array}></Table>
      </div>
    </>
  )
}