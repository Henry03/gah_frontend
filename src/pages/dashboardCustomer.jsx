import { useNavigate } from "react-router-dom";
import CustomerDashboard from "../components/customerDashboard";
import { useState, useEffect } from "react";
import axios from "axios";
import AuthorizationCheck from "../components/auth/authorizationCheck";
import LoadingModal from "../components/LoadingModal";

function DashboardCustomer() {
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
      <AuthorizationCheck role="customer"setRole={setRole}/>
      <CustomerDashboard />
      <LoadingModal />
    </>
    
  );
}

export default DashboardCustomer;