import AuthorizationRoleCheck from "../../components/auth/authorizationRoleCheck"
import PegawaiNavbar from "../../components/pegawai/pegawaiNavbar"
import PegawaiSidebar from "../../components/pegawai/pegawaiSidebar"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Transaksi from "../../components/pegawai/transaksi/transaksi"

function TransaksiPage () {
    const navigate = useNavigate()
    const [role, setRole] = useState('');

    useEffect(() => {
        document.title = "Transaksi"

        if(!localStorage.getItem('token')){
            navigate("/login")
        }
    }
    , [])

    return (
        <div>
            <AuthorizationRoleCheck idRole="5" setRole={setRole}/>
            <PegawaiNavbar/>
            <PegawaiSidebar role={role}><Transaksi/></PegawaiSidebar>
        </div>
    )
}

export default TransaksiPage