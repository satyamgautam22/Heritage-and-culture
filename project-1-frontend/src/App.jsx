import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

import Home from "./pages/Home.jsx";
import Projects from "./pages/Project.jsx";
import Dashboard from "./pages/Dasboard.jsx";
import ProjectDetails from "./pages/Project.jsx"
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import GuideRegisteration from "./pages/GuideRegisteration.jsx";
import Guidelogin from "./pages/Guidelogin.jsx";
import GuideBooking from "./pages/GuideBooking.jsx";
import Success from "./pages/Payementpass.jsx";
import Cancel from "./pages/Fail.jsx";
import ChatRoom from "./pages/ChatRoom.jsx";
import SearchResults from "./pages/SearchResults.jsx";





const App = () => {
  return (
    <>
     
     <Toaster 
     position="top-right"
  reverseOrder={false}
  gutter={8}
  containerClassName=""
  containerStyle={{}}
  toasterId="default"
  toastOptions={{
    // Define default options
    className: '',
    duration: 5000,
    style: {
      background: '#363636',
      color: '#fff',
    },
    success: {
      duration: 3000,
      theme: {
        primary: 'green',
        secondary: 'black',
      },
    },
  }}
/>
   
      <Router>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/guide" element={<GuideRegisteration />} />
          <Route path="/logingguide" element={<Guidelogin />} />
          <Route path="/bookguide" element={<GuideBooking />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/search" element={<SearchResults />} />
         
          


        
          <Route path="/chat/:bookingId" element={<ChatRoom />} />

      

        </Routes>
      </Router>


    </>
  );
};

export default App;
