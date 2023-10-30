import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


function AuthorizationCheck ({role}) {
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
                }
            })
            .catch((err) => {
                navigate("/login")
            })
      
        }
    },[])
}

export default AuthorizationCheck