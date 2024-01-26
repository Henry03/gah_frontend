import { useEffect, useState } from "react";
import Booking from "../../components/customer/booking";
import CustomerNavbar from "../../components/customer/customerNavbar";
import Footer from "../../components/home/footer";
import HomeNavBar from "../../components/homeNavBar";
import axios from "axios";

function BookingPage () {
    const [isLogin, setIsLogin] = useState(false)

    useEffect(() => {
        if(localStorage.getItem('token')){
            axios.get('/sign-in-check', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then((res) => {
                setIsLogin(true)
            })
            .catch((err) => {
                setIsLogin(false)
            })
      
        }
    },[])

    return (
        <div>
            {
                isLogin ? <CustomerNavbar/> : <HomeNavBar/>
            }
            <Booking/>
            <Footer/>
        </div>
    );
}

export default BookingPage;