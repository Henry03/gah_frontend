import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PegawaiNavbar from "../../components/pegawai/pegawaiNavbar"
import PegawaiSidebar from "../../components/pegawai/pegawaiSidebar"
import AuthorizationRoleCheck from "../../components/auth/authorizationRoleCheck"
import Season from "../../components/pegawai/season/season"

function SeasonPage () {
    const [role, setRole] = useState('');

    useEffect(() => {
        document.title = "Season";
        if(!localStorage.getItem('token')){
          navigate("/login")
        }
      }, []);
    

    return (
        <div>
            <AuthorizationRoleCheck idRole="4" setRole={setRole}/>
            <PegawaiNavbar/>
            
            <PegawaiSidebar role={role}><Season/></PegawaiSidebar>
        </div>
    )
}

export default SeasonPage