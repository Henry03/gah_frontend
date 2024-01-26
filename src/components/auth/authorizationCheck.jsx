import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


function AuthorizationCheck ({role, setRole}) {
    const navigate = useNavigate()

    
    useEffect(() => {
        if(localStorage.getItem('token')){
            axios.get('/sign-in-check', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then((res) => {
                if(res.data.data.role !== role){
                    navigate('/hmm')
                }else{
                    setRole(res.data.data.id_role)
                }
            })
            .catch((err) => {
                navigate("/login")
            })
      
        }
    },[])
}

export default AuthorizationCheck