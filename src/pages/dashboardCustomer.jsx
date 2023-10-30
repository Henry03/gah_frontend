import { useNavigate } from "react-router-dom";
import CustomerDashboard from "../components/customerDashboard";
import { useState, useEffect } from "react";
import axios from "axios";
import AuthorizationCheck from "../components/auth/authorizationCheck";

function DashboardCustomer() {
  const navigate = useNavigate();

  useEffect(() => {

    document.title = "Dashboard";
    if(!localStorage.getItem('token')){
      navigate("/login")
    }
  }, []);

  return (
    <>
      <AuthorizationCheck role="customer"/>
      <CustomerDashboard />
    </>
    
  );
}

export default DashboardCustomer;