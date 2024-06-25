import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css"
import Navbar from "../ReusableComponents/Navbar";
import axiosInstance from "../Auth/axiosConfig";
import { useAuth } from "../Auth/authContext";

export default function Login () {
    const sleep = (ms: number | undefined) => new Promise(r => setTimeout(r, ms));
    const { login } = useAuth();
    
    const userRef = React.useRef<HTMLInputElement>(null);
    const errRef = React.useRef<HTMLInputElement>(null);

    const [username, setUsername ] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [password, setPassword ] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{8,24}$/;
    //(?=.*[0-9])(?=.*[!@#$%])
    const navigate = useNavigate()

    useEffect(() => {
        if(userRef.current){
            userRef.current.focus();
        }
    }, [])

    useEffect(() => {
        const result = USER_REGEX.test(username);
        console.log(result);
        console.log(username);
        setValidName(result);
    }, [username])

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        handleLogin();
        setTimeout(() => {
            navigate(`/home/${username}`)
        }, 500)
        
    }
    const handleLogin = async () => {
        try {
            const response = await axiosInstance.get(`/login?username=${username}&password=${password}`)
            console.log("Login Successful", response.data.token)
            login(response.data.token)
            await sleep(500)
            const userN = await axiosInstance.get(`/username`)
            setUsername(userN.data)
            // Redirect or update state to reflect logged-in status
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return(
        <div className="base">
            <div className="signupbox">
                <h1>Login</h1>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <div className="forms">
                <form onSubmit={handleSubmit}>
                    <label className="su-label">
                        <h2 className="signupH2">Username: </h2>
                    </label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        value={username}
                        aria-invalid={validName ? "false" : "true"}
                        aria-describedby="uidnote"
                        placeholder="username"
                        required
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={() => setUserFocus(true)}
                        onBlur={() => setUserFocus(false)}
                    /> 
                    <p id="uidnote" className={userFocus && username && !validName ? "instructions" : "offscreen"}>
                        4 to 24 characters.
                        Must begin with a letter a-z
                        Letters, Numbers, Underscores only.
                    </p>
                    
                    <label className="su-label">
                        <h2 className="signupH2">Password: </h2>
                    </label>
                    <input
                        type="text"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby="pwdnote"
                        placeholder="password"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                        required
                    />
                    <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                        This little note means YOU fucked up your password
                    </p>
                    <button className="signbutton">Login</button>
                </form>
                </div>
            </div>
            
        </div>
    )
}