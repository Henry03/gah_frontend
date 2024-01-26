import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SuccessModal from "../../successModal";
import Error500 from "../../errorHandling/error500";
import Datepicker from "react-tailwindcss-datepicker";

function CustomerDetailModal({id}) {
    const [idCustomer, setId] = useState('1')
    const [noIdentitas, setNoIdentitas] = useState('')
    const [jenisIdentitas, setJenisIdentitas] = useState('')
    const [namaInstitusi, setNamaInstitusi] = useState('')
    const [nama, setNama] = useState('')
    const [email, setEmail] = useState('')
    const [noTelp, setNoTelp] = useState('')
    const [alamat, setAlamat] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    const [errorMessage, setErrorMessage] = useState([])

    const getData = () => {
        const loading = document.getElementById('loading_modal')
        const errorModal = document.getElementById('error_500_modal')
        loading.showModal()

        axios.get('/customer/'+id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setId(response.data.data.id)
            setNoIdentitas(response.data.data.no_identitas)
            setJenisIdentitas(response.data.data.jenis_identitas)
            setNamaInstitusi(response.data.data.nama_institusi)
            setNama(response.data.data.nama)
            setEmail(response.data.data.email)
            setNoTelp(response.data.data.no_telp)
            setAlamat(response.data.data.alamat)

            loading.close()
        })
        .catch(error => {
            loading.close()
            // errorModal.showModal()
        })
    }

    // const edit = () => {
    //     const data = {
    //         id_jenis_customer: 2,
    //         no_identitas: noIdentitas,
    //         jenis_identitas: jenisIdentitas,
    //         nama_institusi: namaInstitusi,
    //         nama: nama,
    //         email: email,
    //         no_telp: noTelp,
    //         alamat: alamat 
    //     }

    //     const success = document.getElementById('success_modal')

    //     const loading = document.getElementById('loading_modal')
    //     const errorModal = document.getElementById('error_500_modal')
    //     loading.showModal()

    //     axios.put('/customer/'+id, data, {
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem('token')}`
    //         }
    //     })
    //     .then(response => {
    //         console.log(response)
    //         loading.close()
    //         success.showModal()
    //     })
    //     .catch(error => {
    //         console.log(error)
    //         if(error.response?.status === 422){
    //             setErrorMessage(error.response.data.errors)
    //         }else if(error.response.status === 500){
    //             errorModal.showModal()
    //         }
    //         loading.close()
    //     })
    // }

    // const deleteData = () => {
    //     const loading = document.getElementById('loading_modal')
    //     const modal = document.getElementById('delete_modal')
    //     loading.showModal()

    //     axios.delete('/season/'+id, {
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem('token')}`
    //         }
    //     })
    //     .then(response => {
    //         console.log(response.data.data)
    //         loading.close()
    //         modal.showModal()

    //     })
    //     .catch(error => {
    //         console.log(error.response)
    //         loading.close()
    //     })
    // }

    useEffect(() => {
        getData()
    },[id])

    return (
        <>
            <dialog id="customer_modal" className="modal">
                <div className="modal-box no-scrollbar">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className="items-center">
                            <h5 className="text-xl text-inherit text-center font-bold">Customer</h5>

                        </div>
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">✕</button>
                    </form>
                    <h3 className="font-bold text-lg mt-1">Customer Detail</h3>
                    <hr className="border-gray-300 my-1" />

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Identity Number</span>
                        </label>
                        <input readOnly={!isEdit} type="text" placeholder="1403XXXXX" className="input input-bordered w-full" value={noIdentitas} onChange={(e)=> setNoIdentitas(e.target.value)}/>
                        {
                            errorMessage && errorMessage.no_identitas && noIdentitas=="" ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.no_identitas}</span>
                            </label> : ""
                        }
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Type</span>
                        </label>
                        <select disabled={!isEdit} className="select select-bordered w-full" value={jenisIdentitas} onChange={(e)=>setJenisIdentitas(e.target.value)}>
                            <option disabled value="" selected hidden>Select ID Type</option>
                            <option value={'KTP'}>KTP</option>
                            <option value={'Passport'}>Passport</option>
                        </select>
                        {
                            errorMessage && errorMessage.jenis_identitas && jenisIdentitas == "" ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.jenis_identitas}</span>
                            </label> : ""
                        }
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Institute Name</span>
                        </label>
                        <input readOnly={!isEdit} type="text" placeholder="PT GAH Sejahtera" className="input input-bordered w-full" value={namaInstitusi} onChange={(e)=> setNamaInstitusi(e.target.value)}/>
                        {
                            errorMessage && errorMessage.nama_institusi && namaInstitusi=="" ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.nama_institusi}</span>
                            </label> : ""
                        }
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input readOnly={!isEdit} type="text" placeholder="Enter customer name" className="input input-bordered w-full" value={nama} onChange={(e)=> setNama(e.target.value)}/>
                        {
                            errorMessage && errorMessage.nama && nama=="" ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.nama}</span>
                            </label> : ""
                        }
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input readOnly={!isEdit} type="text" placeholder="Enter customer email" className="input input-bordered w-full" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                        {
                            errorMessage && errorMessage.email || email=="" ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.email}</span>
                            </label> : ""
                        }
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Phone Number</span>
                        </label>
                        <input readOnly={!isEdit} type="text" placeholder="Enter customer phone nuber" className="input input-bordered w-full" value={noTelp} onChange={(e)=> setNoTelp(e.target.value)}/>
                        {
                            errorMessage && errorMessage.no_telp && noTelp=="" ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.no_telp}</span>
                            </label> : ""
                        }
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Address</span>
                        </label>
                        <textarea readOnly={!isEdit} placeholder="Enter customer address" className="textarea textarea-bordered w-full" value={alamat} onChange={(e) => setAlamat(e.target.value)}/>
                        {
                            errorMessage && errorMessage.alamat ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.alamat}</span>
                            </label> : ""
                        }
                    </div>

                    {/* <hr className="my-5" />
                    {
                        isEdit ?
                        <div className="grid grid-cols-2 gap-3">
                            <Link className="btn btn-ghost" onClick={()=>setIsEdit(false)}>Cancel</Link>
                            <Link className="btn btn-success" onClick={(e)=>edit(e)}>Save</Link>
                        </div>
                        :
                        <div className="grid grid-cols-2 gap-3">
                            <Link className="btn btn-warning" onClick={(e)=>setIsEdit(true)}>Edit</Link>
                            <Link className="btn btn-error" onClick={()=>document.getElementById('delete_modal').showModal()}>Hapus</Link>
                        </div>
                    } */}

                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            <SuccessModal id="success_modal" title={'Season Edited Succesfully'} button='Oke' message='Your season data edited' link='/season' onClick={()=>document.getElementById('season_modal').close()}/>
        
        </>
    );
}

export default CustomerDetailModal;