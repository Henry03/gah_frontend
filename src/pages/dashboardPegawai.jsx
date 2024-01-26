import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import PegawaiNavbar from "../components/pegawai/pegawaiNavbar";
import PegawaiSidebar from "../components/pegawai/pegawaiSidebar";
import RoomPage from "./pegawai/room";
import AuthorizationCheck from "../components/auth/authorizationCheck";
import ReportHome from "../components/pegawai/report/reportHome";

function DashboardPegawai() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');

  useEffect(() => {
    document.title = "Dashboard";
    if(!localStorage.getItem('token')){
      navigate("/login")
    }
  }, []);

  return (
    <>
      <AuthorizationCheck role="pegawai" setRole={setRole}/>
      <PegawaiNavbar/>
      {
        role == 3 || role == 1?
        <PegawaiSidebar role={role}><ReportHome/></PegawaiSidebar>
        : 
        <PegawaiSidebar role={role}></PegawaiSidebar>
      }
    </>
    
  );
}

export default DashboardPegawai;