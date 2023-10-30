import AuthorizationRoleCheck from "../../components/auth/authorizationRoleCheck"
import Customer from "../../components/pegawai/customer/customer"
import PegawaiNavbar from "../../components/pegawai/pegawaiNavbar"
import PegawaiSidebar from "../../components/pegawai/pegawaiSidebar"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Reservasi from "../../components/pegawai/reservasi/reservasi"

function ReservasiPage () {
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Customer Grup"

        if(!localStorage.getItem('token')){
            navigate("/login")
        }
    }
    , [])

    return (
        <div>
            <AuthorizationRoleCheck idRole="4"/>
            <PegawaiNavbar/>
            <PegawaiSidebar><Reservasi/></PegawaiSidebar>
        </div>
    )
}

export default ReservasiPage