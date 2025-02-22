import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Signup from './Pages/Signup.tsx';
import Home from './Pages/Home.tsx';
import { AuthProvider } from './Auth/authContext.tsx'
import Login from './Pages/Login.tsx';
import Layout from './Layout.tsx';
import PlayerSearch from './Pages/PlayerSearch.tsx';
import TeamCentral from './Pages/TeamCentral.tsx';
import GameLog from './Pages/GameLog.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <App></App>
      },
      {
        path: "/playersearch",
        element: <PlayerSearch/>,
      },
      {
        path: "signup",
        element: <Signup></Signup>
      },
      {
        path: "login",
        element: <Login></Login>
      },
      {
        path: "home",
        element: <Home></Home>
      },
      {
        path: "teamcentral",
        element: <TeamCentral></TeamCentral>
      },
      {
        path: "game-logs",
        element: <GameLog></GameLog>
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
        <RouterProvider router={router}/>
    </AuthProvider>
  </React.StrictMode>,
)
