import AuthorizationRoleCheck from "../../components/auth/authorizationRoleCheck"
import Customer from "../../components/pegawai/customer/customer"
import PegawaiNavbar from "../../components/pegawai/pegawaiNavbar"
import PegawaiSidebar from "../../components/pegawai/pegawaiSidebar"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function CustomerPage () {
    const navigate = useNavigate()
    const [role, setRole] = useState('');

    useEffect(() => {
        document.title = "Customer Grup"

        if(!localStorage.getItem('token')){
            navigate("/login")
        }
    }
    , [])

    return (
        <div>
            <AuthorizationRoleCheck idRole="4" setRole={setRole}/>
            <PegawaiNavbar/>
            <PegawaiSidebar role={role}><Customer/></PegawaiSidebar>
        </div>
    )
}

export default CustomerPage