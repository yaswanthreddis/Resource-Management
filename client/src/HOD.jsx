import React from "react";
import {  Routes, Route } from "react-router-dom";
import Home from './pages/HOD/Home.jsx'
import Room from './pages/HOD/Room.jsx'
import Request from './pages/HOD/Request.jsx'
import Lab from "./pages/HOD/Lab.jsx";
import Nav from "./Nav.jsx";
function HOD(){
    
    
    return(
    
        <>
        
        <div className="flex flex-col h-screen">
          
        <Nav />
        

        <div className="mt-8 flex flex-grow overflow-hidden">
              <div className="flex-grow overflow-y-auto">
                  <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/room" element={<Room />} />
                      <Route path="/lab" element={<Lab />} />
                      <Route path="/request" element={<Request />}/>
                  </Routes>
              </div>
          </div>

        </div>

        </>
    
    

    )
    
}

export default HOD