import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


function AuthorizationRoleCheck ({idRole, setRole}) {
    const navigate = useNavigate()

    
    useEffect(() => {
        if(!localStorage.getItem('token')){
            navigate("/login")
        }
        if(localStorage.getItem('token')){
            axios.get('/sign-in-check', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then((res) => {
                if(res.data.data.role !== 'pegawai'){
                    navigate('/hmm')
                }else{
                    if(res.data.data.id_role != idRole){
                        navigate('/hmm')
                    }else{
                        setRole(res.data.data.id_role)
                    }
                }
            })
            .catch((err) => {
                navigate("/login")
            })
      
        }
    },[idRole])
}

export default AuthorizationRoleCheck