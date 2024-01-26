import {useState, useRef, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import LoadingModal from './LoadingModal'
import Error500 from './errorHandling/error500'
import Error from './errorHandling/error'

function LoginForm(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState([])

    const navigate = useNavigate()

    
    const submitForm = (e) =>{
        e.preventDefault()
        
        const data = {
            email: email,
            password: password
        }
        
        const loading = document.getElementById('loading_modal')
        const errorModal = document.getElementById('error_login')
        const unauthenticatedModal = document.getElementById('credential')
        loading.showModal()
        setLoading(true)
        
        axios.post('/login', data)
        .then((res) => {
            loading.close()
            setLoading(false)
            setErrorMessage("")
            localStorage.setItem('token', res.data.token)
            if(res.data.data.role === 'customer'){
                navigate("/")
            }else if(res.data.data.role === 'pegawai'){
                navigate("/pegawai/dashboard")
            }
        })
        .catch((err) => {
            loading.close()
            setLoading(false)
            if(err.response.status == 401){
                unauthenticatedModal.showModal()
            } else if(err.response.status == 422){
                setErrorMessage(err.response.data.errors)
            } else {
                errorModal.showModal()

            }
        })

    }

    useEffect(() => {
        if(localStorage.getItem('token')){
            axios.get('/sign-in-check', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then((res) => {
                if(res.data.data.role === 'customer'){
                    navigate("/")
                }else if(res.data.data.role === 'pegawai'){
                    navigate("/pegawai/dashboard")
                }
            })
            .catch((err) => {
            })
        }
    }, [])

    return(
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl  shadow-xl">
                <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
                <div className=''>
                        {/* <LandingIntro /> */}
                </div>
                <div className='py-24 px-10'>
                    <h2 className='text-2xl font-semibold mb-2 text-center'>Login</h2>
                    <form onSubmit={(e) => submitForm(e)}>

                        <div className="mb-4 w-full">

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="text" placeholder="example@gah.com" className="input input-bordered w-full" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                                {
                                    errorMessage && errorMessage.email ? <label className="label">
                                    <span className="label-text-alt text-red-600">{errorMessage.email}</span>
                                    </label> : ""
                                }
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input type="password" placeholder="password" className="input input-bordered w-full" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                {
                                    errorMessage && errorMessage.password ? <label className="label">
                                    <span className="label-text-alt text-red-600">{errorMessage.password}</span>
                                    </label> : ""
                                }
                            </div>

                        </div>

                        <div className='text-right text-primary'>
                            <Link to="/forgot-password">
                                <span className="text-sm  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                                    Forgot Password?
                                </span>
                            </Link>
                        </div>

                        <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Login</button>

                        <div className='text-center mt-4'>Don't have an account yet? <Link to="/signup"><span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Register</span></Link></div>
                    </form>
                </div>
            </div>
            </div>
            <LoadingModal />
            <Error500 id="error_login" title="Error happened" message="Something went wrong, please refresh this page or contact support@gah.com"/>
            <Error id="credential" title="Unauthenticated" message="Your username or password is wrong" button="oke" />
        </div>
    )
}

export default LoginForm