import AuthorizationRoleCheck from "../../components/auth/authorizationRoleCheck"
import Fasilitas from "../../components/pegawai/fasilitas/fasilitas"
import PegawaiNavbar from "../../components/pegawai/pegawaiNavbar"
import PegawaiSidebar from "../../components/pegawai/pegawaiSidebar"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function FasilitasPage () {
    const navigate = useNavigate()
    const [role, setRole] = useState('');

    useEffect(() => {
        document.title = "Facility"

        if(!localStorage.getItem('token')){
            navigate("/login")
        }
    }
    , [])

    return (
        <div>
            <AuthorizationRoleCheck idRole="4" setRole={setRole}/>
            <PegawaiNavbar/>
            <PegawaiSidebar role={role}><Fasilitas/></PegawaiSidebar>
        </div>
    )
}

export default FasilitasPage