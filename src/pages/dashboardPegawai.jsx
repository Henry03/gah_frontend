import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import PegawaiNavbar from "../components/pegawai/pegawaiNavbar";
import PegawaiSidebar from "../components/pegawai/pegawaiSidebar";
import RoomPage from "./pegawai/room";
import AuthorizationCheck from "../components/auth/authorizationCheck";

function DashboardPegawai() {
  const navigate = useNavigate();

  useEffect(() => {

    document.title = "Dashboard";
    if(!localStorage.getItem('token')){
      navigate("/login")
    }
  }, []);

  return (
    <>
      <AuthorizationCheck role="pegawai"/>
      <PegawaiNavbar/>
      <PegawaiSidebar></PegawaiSidebar>
    </>
    
  );
}

export default DashboardPegawai;