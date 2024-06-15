import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [count, setCount] = useState(0);
  const [array, setArray] = useState([])

  const fetchAPI = async (pname: string, season: number) => {
    const response = await axios.get(`http://localhost:8080/api/stats?name=${pname}&season=${season}`)
    console.log(response.data)
    setArray(response.data)
  }

  // useEffect(() => {
  //   fetchAPI("lebron james", 21)
  // },[])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => fetchAPI("Chris Paul", count)}></button>
        <p>
          {array.map((user, index) => (
            <span key={index}>{user} </span>
          ))}
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
