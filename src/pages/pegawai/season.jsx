import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import PegawaiNavbar from "../../components/pegawai/pegawaiNavbar"
import PegawaiSidebar from "../../components/pegawai/pegawaiSidebar"
import AuthorizationRoleCheck from "../../components/auth/authorizationRoleCheck"
import Season from "../../components/pegawai/season/season"

function SeasonPage () {

    useEffect(() => {
        document.title = "Room"

    }
    , [])

    return (
        <div>
            <AuthorizationRoleCheck idRole="4"/>
            <PegawaiNavbar/>
            
            <PegawaiSidebar><Season/></PegawaiSidebar>
        </div>
    )
}

export default SeasonPage