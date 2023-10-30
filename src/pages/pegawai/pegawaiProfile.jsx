import NavBar from "../../components/NavBar";
import { useEffect, useState } from "react";
import profile from "../../assets/Linguini.png";
import { Link, useNavigate } from "react-router-dom";
import axios  from "axios";
import LoadingModal from "../../components/LoadingModal";
import ChangePasswordModal from "../../components/changePasswordModal";
import SuccessModal from "../../components/successModal";

function PegawaiProfile() {
    const [noIdentitas, setNoIdentitas] = useState('')
    const [jenisIdentitas, setJenisIdentitas] = useState('')
    const [nama, setNama] = useState('')
    const [noTelp, setNoTelp] = useState('')
    const [alamat, setAlamat] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState([])
    const [isEdit, setIsEdit] = useState(false)

    const navigate = useNavigate()

    const submitForm = (e) =>{
        e.preventDefault()
        
        const data = {
            nama: nama,
            no_telp: noTelp,
            alamat: alamat
        }
        
        const success_modal = document.getElementById('update_profile')
        const loading = document.getElementById('loading_modal')
        loading.showModal()
        setLoading(true)
        
        axios.put('/pegawai',data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => {
            loading.close()
            setLoading(false)
            setIsEdit(false)
            success_modal.showModal()
            // window.location.href = "/dashboard"
        })
        .catch((err) => {
            loading.close()
            setLoading(false)
            setErrorMessage(err.response.data.errors)
            console.log(errorMessage)
        })
    }

    const getData = () => {
        axios.get('/pegawai', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => {
            setNama(res.data.data.nama)
            setNoTelp(res.data.data.no_telp)
            setAlamat(res.data.data.alamat)
        })
        .catch((err) => {
        })
    }

    useEffect(() => {
        getData()

        if(!localStorage.getItem('token')){
            navigate("/login")
        }
    }, [])

    return(
        <>
            <NavBar/>
            <div className="bg-base-200 flex items-center">
                <div className="card mx-auto my-5 w-full max-w-5xl shadow-xl">
                    <div className="bg-base-100 rounded-xl">
                        <div className="p-10 card lg:card-side">
                            <figure><img className="rounded-xl h-60 w-60 object-center object-cover" src={profile} alt="Album"/></figure>
                            <div className=" card-body w-full justify-center">
                                <div className="card-actions md:justify-center lg:justify-end justify-center">
                                    <Link onClick={()=>document.getElementById('change_password_modal').showModal()} className="btn btn-border">Change Password</Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-base-200 flex items-center">
                <div className="card mx-auto mb-5 w-full max-w-5xl shadow-xl">
                    <div className="bg-base-100 rounded-xl">
                        <div className="p-10">
                            {
                                !isEdit ?
                                    <h2 className='text-2xl font-semibold mb-2'>Your Information</h2>
                                    :
                                    <h2 className='text-2xl font-semibold mb-2'>Enter Your New Information</h2>

                            }
                            <form>
                                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">

                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Name</span>
                                        </label>
                                        <input readOnly={!isEdit} type="text" placeholder="Enter your name" className="input input-bordered w-full" value={nama} onChange={(e)=> setNama(e.target.value)}/>
                                        {
                                            errorMessage && errorMessage.nama ? <label className="label">
                                            <span className="label-text-alt text-red-600">{errorMessage.nama}</span>
                                            </label> : ""
                                        }
                                    </div>

                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Phone Number</span>
                                        </label>
                                        <input readOnly={!isEdit} type="text" placeholder="Enter your phone number" className="input input-bordered w-full" value={noTelp} onChange={(e) => setNoTelp(e.target.value)}/>
                                        {
                                            errorMessage && errorMessage.no_telp ? <label className="label">
                                            <span className="label-text-alt text-red-600">{errorMessage.no_telp}</span>
                                            </label> : ""
                                        }
                                    </div>
                                </div>
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Address</span>
                                    </label>
                                    <textarea readOnly={!isEdit} placeholder="Enter your address" className="textarea textarea-bordered w-full" value={alamat} onChange={(e) => setAlamat(e.target.value)}/>
                                    {
                                        errorMessage && errorMessage.alamat ? <label className="label">
                                        <span className="label-text-alt text-red-600">{errorMessage.alamat}</span>
                                        </label> : ""
                                    }
                                </div>
                            </form>
                            {
                                isEdit ?
                                <div className="flex md:justify-center lg:justify-end justify-center mt-7 gap-4">
                                    <button className="btn btn-ghost hover:btn-error lg:w-auto " onClick={()=>setIsEdit(false)}>Cancel</button>
                                    <button className="btn btn-primary lg:w-auto" onClick={(e)=>{submitForm(e)}}>Save</button>
                                </div>
                                :
                                <div className="flex md:justify-center lg:justify-end justify-center mt-7">
                                        <button className="btn btn-border lg:w-auto w-full" onClick={()=>setIsEdit(true)}>Change Profile</button>
                                </div>


                            }
                        </div>

                    </div>
                </div>
            </div>
            <LoadingModal/>
            <SuccessModal id="update_profile" message="Succesfully Change Your Profile" title="" button="Oke" link="/pegawai/profile" onClick={()=>document.getElementById('change_password_modal').close()}/>
            <ChangePasswordModal/>
            
        </>
    )
}

export default PegawaiProfile;