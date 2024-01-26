import React, { useState, useEffect } from 'react'
import HomeNavBar from '../components/homeNavBar'
import Hotel1 from '../assets/hotel-1.jpg'
import Superior from '../assets/superior.jpg'
import DoubleDeluxe from '../assets/double_deluxe.jpg'
import ExclusiveDeluxe from '../assets/exclusive_deluxe.jpg'
import JuniorSuite from '../assets/junior_suite.jpg'
import Datepicker from 'react-tailwindcss-datepicker'
import { Link } from 'react-router-dom'
import RoomCard from '../components/home/roomCard'
import Footer from '../components/home/footer'
import CustomerNavbar from '../components/customer/customerNavbar'
import axios from 'axios'
import DetailKamarModal from '../components/home/detailKamarModal'

const HomePage = () => {
    const [isLogin, setIsLogin] = useState(false)
    const [id, setId] = useState(1)

    const detailHandler = (id) => {
        const detailKamarModal = document.getElementById('detail_kamar_modal')
        setId(id)
        detailKamarModal.showModal()
    
    }

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
            <div className="hero min-h-screen" style={{backgroundImage: `url(${Hotel1})`}}>
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-center text-neutral-content">
                    <h1 className="text-5xl md:text-7xl max-w-3xl mx-auto">Enjoy your life</h1>
                    
                    
                </div>
                
            </div>
            <div className='p-4'>
                <h2 className='text-bold text-2xl m-5'>Choose Your Choice</h2>

                <div className='flex flex-row gap-4 justify-evenly flex-wrap'>
                    <RoomCard img={Superior} title="Superior" message="Kamar 22 meter persegi yang akan memberikan pengalaman terbaik" onClick={()=>detailHandler('1')}/>
                    <RoomCard img={DoubleDeluxe} title="Double Deluxe" message="Kamar 24 meter persegi dengan berbagai tempat wisata" onClick={()=>detailHandler('2')}/>
                    <RoomCard img={ExclusiveDeluxe} title="Exclusive Deluxe" message="Kamar berukuran 36 meter persegi, menampilkan pemandangan kota" onClick={()=>detailHandler('3')}/>
                    <RoomCard img={JuniorSuite} title="Junior Suite" message="Kamar berukuran 46 meter persegi, menampilkan pemandangan kota" onClick={()=>detailHandler('4')}/>
                    
                </div>
            </div>
            <Footer/>
            
            <DetailKamarModal id={id}/>
        </div>

    )
}

export default HomePage