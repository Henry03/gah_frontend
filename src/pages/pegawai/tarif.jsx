import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PegawaiNavbar from "../../components/pegawai/pegawaiNavbar"
import PegawaiSidebar from "../../components/pegawai/pegawaiSidebar"
import AuthorizationRoleCheck from "../../components/auth/authorizationRoleCheck"
import Tarif from "../../components/pegawai/Tarif/tarif"


function TarifPage () {

    const [role, setRole] = useState('');


    useEffect(() => {
        document.title = "Price"

    }
    , [])

    return (
        <div>
            <AuthorizationRoleCheck idRole="4" setRole={setRole}/>
            <PegawaiNavbar/>
            
            <PegawaiSidebar role={role}><Tarif/></PegawaiSidebar>
        </div>
    )
}

export default TarifPage