import React from "react";
import Nav2 from "./Nav2";
import Home from "./pages/admin/Home";
import Resource from "./pages/admin/Resource";

import { Route, Routes } from "react-router-dom";

function Faculty() {
  return (
      <div className="flex flex-col h-screen">
          <Nav2 />

          <div className="mt-8 flex flex-grow overflow-hidden">
              <div className="flex-grow overflow-y-auto">
                  <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/resource" element={<Resource />} />
                      
                  </Routes>
              </div>
          </div>
      </div>
  );
}

export default Faculty