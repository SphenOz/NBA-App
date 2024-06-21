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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "signup",
    element: <Signup></Signup>
  },
  {
    path: "home/:username",
    element: <Home></Home>
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
