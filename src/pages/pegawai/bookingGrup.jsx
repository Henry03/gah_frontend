import { useEffect, useState } from "react";
import Booking from "../../components/customer/booking";
import CustomerNavbar from "../../components/customer/customerNavbar";
import Footer from "../../components/home/footer";
import HomeNavBar from "../../components/homeNavBar";
import axios from "axios";
import BookingGrup from "../../components/pegawai/transaction/bookingGrup";
import PegawaiNavbar from "../../components/pegawai/pegawaiNavbar";
import AuthorizationCheck from "../../components/auth/authorizationCheck";
import AuthorizationRoleCheck from "../../components/auth/authorizationRoleCheck";
import PegawaiSidebar from "../../components/pegawai/pegawaiSidebar";

function BookingGrupPage () {
    const [role, setRole] = useState('');

    useEffect(() => {
        document.title = "Dashboard";
        if(!localStorage.getItem('token')){
          navigate("/login")
        }
      }, []);

    return (
        <div>
            <AuthorizationRoleCheck idRole="4" setRole={setRole}/>
            <PegawaiNavbar/>
            <PegawaiSidebar role={role}><BookingGrup/></PegawaiSidebar>
            <Footer/>
        </div>
    );
}

export default BookingGrupPage;