import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home';
import About from './pages/about';
import Signup from './pages/signup';
import Login from './pages/login';
import DashboardCustomer from './pages/dashboardCustomer';
import DashboardPegawai from './pages/dashboardPegawai';
import ProfilePage from './pages/profile';
import NotFoundPage from './pages/errorHandling/notFoundPage';
import RoomPage from './pages/pegawai/room';
import NotAllowedPage from './pages/errorHandling/notAllowed';
import PegawaiProfile from './pages/pegawai/pegawaiProfile';
import SeasonPage from './pages/pegawai/season';
import TarifPage from './pages/pegawai/tarif';
import FasilitasPage from './pages/pegawai/fasilitas';
import CustomerPage from './pages/pegawai/customer';
import Reservasi from './components/pegawai/reservasi/reservasi';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/dashboard' element={<DashboardCustomer/>} />
        <Route path='/profile' element={<ProfilePage/>} />

        <Route path="/pegawai/dashboard" element={<DashboardPegawai/>} />
        <Route path="/pegawai/profile" element={<PegawaiProfile/>} />
        <Route path="/room" element={<RoomPage/>} />

        <Route path="/season" element={<SeasonPage/>} />
        <Route path="/tarif" element={<TarifPage/>} />
        <Route path="/facility" element={<FasilitasPage/>} />
        <Route path="/customer/grup" element={<CustomerPage/>} />
        <Route path="/reservation" element={<Reservasi/>} />

        <Route path='/upps' element={<NotFoundPage/>} />
        <Route path='/hmm' element={<NotAllowedPage/>} />
        <Route path='*' element={<NotFoundPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
