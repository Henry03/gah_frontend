import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import PegawaiNavbar from "../../components/pegawai/pegawaiNavbar"
import PegawaiSidebar from "../../components/pegawai/pegawaiSidebar"
import Room from "../../components/pegawai/room"
import AuthorizationRoleCheck from "../../components/auth/authorizationRoleCheck"

function RoomPage () {
    const navigate = useNavigate()
    const [role, setRole] = useState('');

    useEffect(() => {
        document.title = "Room"

        if(!localStorage.getItem('token')){
            navigate("/login")
        }
    }
    , [])

    return (
        <div>
            <AuthorizationRoleCheck idRole="2" setRole={setRole}/>
            <PegawaiNavbar/>
            
            <PegawaiSidebar role={role}><Room/></PegawaiSidebar>
        </div>
    )
}

export default RoomPage