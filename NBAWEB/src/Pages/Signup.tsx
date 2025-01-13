import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css"
import axios from "axios";
import Navbar from "../ReusableComponents/Navbar";
import axiosInstance from "../Auth/axiosConfig";

export default function Signup () {
    const userRef = React.useRef<HTMLInputElement>(null);
    const errRef = React.useRef<HTMLInputElement>(null);

    const [username, setUsername ] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [password, setPassword ] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

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
        setValidPwd(PWD_REGEX.test(password));
        setValidMatch(password === matchPwd);
        console.log(password)
        if(validMatch){
            console.log("YO")
        }
        if(validPwd){
            console.log("OK ITS VALID")
        }
    }, [password, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [username, password, matchPwd])

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const v1 = USER_REGEX.test(username);
        const v2 = PWD_REGEX.test(password);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        console.log("Submitted")
        const response = await axiosInstance.post(`signup`,
            {
                user_name: username,
                password: password
            }
        );
        console.log(response.data)
        setTimeout(() => {
            navigate(`/login`)
        }, 500)
        
    }
    return(
        <div className="base">
            <div className="signupbox">
                <h1>Register</h1>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <div className="forms">
                <form onSubmit={handleSubmit}>
                    <label className="su-label">
                        <h2 className="signupH2">Username: </h2>
                    </label>
                    <input
                        className="su-input"
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
                        className="su-input"
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
                    <label className="su-label">
                        <h2 className="signupH2">Confirm Password:</h2>
                    </label>
                    <input
                        type="text"
                        id="confirm_pwd"
                        className="su-input"
                        value={matchPwd}
                        onChange={(e) => setMatchPwd(e.target.value)} 
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby="confirmnote"
                        placeholder="password"
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                        required
                        />
                    <p id="confirmnote" className={matchFocus && !validPwd ? "instructions" : "offscreen"}>
                        This little note means YOU fucked up confirming your password
                    </p>
                    <button disabled={!validMatch || !validPwd || !validName ? true : false} className="signbutton">Sign Up</button>
                </form>
                <Link to={'/login'}>Have an account?</Link>
                </div>
            </div>
            
        </div>
    )
}
//Credit: https://www.youtube.com/watch?v=brcHK3P6ChQ&list=PL0Zuz27SZ-6PRCpm9clX0WiBEMB70FWwd