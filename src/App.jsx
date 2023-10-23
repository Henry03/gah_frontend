import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home';
import About from './pages/about';
import Signup from './pages/signup';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import ProfilePage from './pages/profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/profile' element={<ProfilePage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
