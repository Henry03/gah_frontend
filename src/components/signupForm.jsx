import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import SuccessModal from './successModal'
import LoadingModal from './LoadingModal'

function SignupForm(){
    const [noIdentitas, setNoIdentitas] = useState("")
    const [jenisIdentitas, setJenisIdentitas] = useState("")
    const [nama, setNama] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [noTelp, setNoTelp] = useState("")
    const [alamat, setAlamat] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState([])

    const submitForm = (e) =>{
        e.preventDefault()

        const data = {
            id_jenis_customer: 1,
            no_identitas: noIdentitas,
            jenis_identitas: jenisIdentitas,
            nama: nama,
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
            no_telp: noTelp,
            alamat: alamat
        }
        const loading = document.getElementById('loading_modal')

        loading.showModal()
        setLoading(true)
        
        axios.post('/register/customer', data)
        .then((res) => {
            console.log(res)
            setLoading(false)
            setErrorMessage("")
            // window.location.href = "/login"
            loading.close()
            document.getElementById('success_signup').showModal()
        })
        .catch((err) => {
            console.log(err)
            setLoading(false)
            setErrorMessage(err.response.data.errors)
            loading.close()
            console.log(errorMessage)
        })

    }

    useEffect(() => {
        if(localStorage.getItem('token')){
            window.location.href = "/dashboard"
        }
    })

    return(
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-2xl  shadow-xl">
                <div className="grid  md:grid-cols-1 grid-cols-1  bg-base-100 rounded-xl">
                <div className=''>
                        {/* <LandingIntro /> */}
                </div>
                <div className='py-24 px-10'>
                    <h2 className='text-2xl font-semibold mb-2 text-center'>Sign Up</h2>
                    <form onSubmit={(e) => submitForm(e)}>

                        <div className="mb-4 w-full">

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">ID Number</span>
                                </label>
                                <input type="text" placeholder="1403xxxxxx" className="input input-bordered w-full" value={noIdentitas} onChange={(e)=> setNoIdentitas(e.target.value)}/>
                                {
                                    errorMessage && errorMessage.no_identitas ? <label className="label">
                                    <span className="label-text-alt text-red-600">{errorMessage.no_identitas}</span>
                                    </label> : ""
                                }
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Identity Type</span>
                                </label>
                                <select className="select select-bordered w-full" onChange={(e)=>setJenisIdentitas(e.target.value)}>
                                    <option disabled selected>Select ID Type</option>
                                    <option value={'KTP'}>KTP</option>
                                    <option value={'Passport'}>Passport</option>
                                    </select>
                                {
                                    errorMessage && errorMessage.jenis_identitas ? <label className="label">
                                    <span className="label-text-alt text-red-600">{errorMessage.jenis_identitas}</span>
                                    </label> : ""
                                }
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input type="text" placeholder="Enter your name" className="input input-bordered w-full" value={nama} onChange={(e)=> setNama(e.target.value)}/>
                                {
                                    errorMessage && errorMessage.nama ? <label className="label">
                                    <span className="label-text-alt text-red-600">{errorMessage.nama}</span>
                                    </label> : ""
                                }
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="email" placeholder="example@gah.com" className="input input-bordered w-full" value={email} onChange={(e)=> setEmail(e.target.value)}/>
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
                                <input type="password" placeholder="Enter your password" className="input input-bordered w-full" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                {
                                    errorMessage && errorMessage.password ? <label className="label">
                                    <span className="label-text-alt text-red-600">{errorMessage.password}</span>
                                    </label> : ""
                                }
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Password Confirmation</span>
                                </label>
                                <input type="password" placeholder="Enter your password" className="input input-bordered w-full" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}/>
                                {
                                    errorMessage && errorMessage.password_confirmation ? <label className="label">
                                    <span className="label-text-alt text-red-600">{errorMessage.password_confirmation}</span>
                                    </label> : ""
                                }
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Phone Number</span>
                                </label>
                                <input type="text" placeholder="Enter your phone number" className="input input-bordered w-full" value={noTelp} onChange={(e) => setNoTelp(e.target.value)}/>
                                {
                                    errorMessage && errorMessage.no_telp ? <label className="label">
                                    <span className="label-text-alt text-red-600">{errorMessage.no_telp}</span>
                                    </label> : ""
                                }
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Address</span>
                                </label>
                                <textarea placeholder="Enter your address" className="textarea textarea-bordered w-full" value={alamat} onChange={(e) => setAlamat(e.target.value)}/>
                                {
                                    errorMessage && errorMessage.alamat ? <label className="label">
                                    <span className="label-text-alt text-red-600">{errorMessage.alamat}</span>
                                    </label> : ""
                                }
                            </div>

                        </div>

                        <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>Sign Up</button>

                        <div className='text-center mt-4'>Already have an account yet? <Link to="/login"><span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Login</span></Link></div>
                    </form>
                </div>
            </div>
            </div>
            <SuccessModal id="success_signup" message="Thank You for become our family" title="Account Registered" button="Login" link="/login"/>
            <LoadingModal />
        </div>
    )
}

export default SignupForm