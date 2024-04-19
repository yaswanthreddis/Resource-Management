// Login.js
import { Navigate, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from 'axios';

import Button1 from "./components/Button1";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const navigate = useNavigate();

  const handleLogin = async () => {
    
    try {
      const data = { username, password, role }
      const res = await axios.post(`http://localhost:3001/login`, data);
      console.log("res",res);
      console.log("Role",res.data.Role);
      if (res.data.success) {
        console.log(res)
        if (res.data.results[0].Role === "Faculty") {
          navigate('/faculty');
        /* 
        else if(res.data.results[0].Role === "Admin"){
          navigate('/admin');
        }*/
        } else {
          navigate('/hod');
        }
      }
      else {
        // Login failed, display error message
        alert(response.data.message);
      }
    }
    catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred while logging in. Please try again.');
    };
  };

  return (
    <>
      {/* Login form */}
      <div className="w-screen h-svh -mt-5 md:mt-0  md:h-screen grid grid-row justify-center items-center accent-primary">
        <div className="bg-slate-100 flex flex-col items-center rounded-md shadow-2xl w-80  md:w-100">
          {/* Form fields */}
          <div className="py-4">
            <h1 className="text-2xl md:text-3xl  font-bold">Resource Management<span className="text-primary">.</span></h1>
          </div>
          <div className="py-2">
            <h1 className="text-xl md:text-2xl  font-bold">Log in<span className="text-primary"></span></h1>
          </div>
          <div className="py-4">
            <input type="radio" name="role" className="mr-1" value="Admin" checked={role === "Admin"} onChange={() => setRole('Admin')} /><span className="mr-8 md:mr-20 font-medium">Admin</span>
            <input type="radio" name="role" className="mr-1" value="HOD" checked={role === "HOD"} onChange={() => setRole('HOD')} /><span className="mr-8 md:mr-20 font-medium">HOD</span>
            <input type="radio" name="role" className="mr-1" value="Faculty" checked={role === "Faculty"} onChange={() => setRole('Faculty')} /><span className="font-medium">Faculty</span>
          </div>
          <div className="py-4">
            <div className="pb-3 font-medium">
              <span>User Name:</span><br />
            </div>
            <div>
              <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="User Name" className="py-2 outline outline-slate-300 focus:outline-none rounded-md pl-1 disabled:border-b-2 disabled:border-slate-300 w-48 md:w-72 h-9 focus:outline-primary text-slate-400 focus:text-primary " />
            </div>
          </div >
          <div className="py-4">
            <div className="pb-3 font-medium">
              <span>Password:</span><br />
            </div>
            <div>
              <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="py-2 outline outline-slate-300 focus:outline-none rounded-md pl-1 disabled:border-b-2 disabled:border-slate-300 w-48 md:w-72 h-9 focus:outline-primary text-slate-400 focus:text-primary " />
            </div>
          </div>
          <div className="py-4">
            {/* Login button */}
            <button name="Log in" className="btn btn-sm btn-primary" style={{backgroundColor:"#486ce4",color:"white",width:"75px",height:"35px", borderRadius:"10%"}} onClick={() => {
              handleLogin();
            }} >Login</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login;
