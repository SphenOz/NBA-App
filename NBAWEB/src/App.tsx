import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import Table from './Table'
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import SearchPage from './Pages/PlayerSearch.tsx'

function App() {
  return (
    <>
      <SearchPage></SearchPage>
    </>
  )
}

export default App
