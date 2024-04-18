import React from "react";
import Nav1 from "./Nav1";
import Home from "./pages/faculty/Home";
import Room from "./pages/faculty/Room";
import Request from "./pages/faculty/Request"
import { Route, Routes } from "react-router-dom";

function Faculty() {
  return (
      <div className="flex flex-col h-screen">
          <Nav1 />

          <div className="mt-8 flex flex-grow overflow-hidden">
              <div className="flex-grow overflow-y-auto">
                  <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/room" element={<Room />} />
                      <Route path="/request" element={<Request />}/>
                  </Routes>
              </div>
          </div>
      </div>
  );
}

export default Faculty