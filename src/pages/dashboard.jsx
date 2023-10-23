import { useEffect } from "react";
import NavBar from "../components/NavBar";

function Dashboard() {
    useEffect(() => {
        document.title = "Dashboard";
        if(!localStorage.getItem('token')){
            window.location.href = "/login"
        }
    }, []);
  return (
    <div>
        <NavBar />
    </div>
  );
}

export default Dashboard;