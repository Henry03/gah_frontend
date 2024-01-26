import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SuccessModal from "../../successModal";
import Error from "../../errorHandling/error";

function AddKamarModal() {
    const [idKamar, setId] = useState('')
    const [idStatus, setStatus] = useState('1')
    const [tipe, setTipe] = useState('1')
    const [tempatTidur, setTempatTidur] = useState('')
    const [deskripsi, setDeskripsi] = useState('')
    const [kapasitas, setKapasitas] = useState('')
    const [rincian, setRincian] = useState('')
    const [errorMessage, setErrorMessage] = useState({})

    const add = () => {
        console.log(idStatus)
        const data = {
            id: idKamar,
            id_status_kamar: idStatus,
            id_jenis_kamar: tipe,
            tempat_tidur: tempatTidur,
            deskripsi: deskripsi,
            rincian: rincian,
            kapasitas: kapasitas,
        }

        const success = document.getElementById('success_add_modal')
        const errorModal = document.getElementById('error_500_modal')

        const loading = document.getElementById('loading_modal')
        loading.showModal()

        axios.post('/kamar', data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            console.log(response.data.data)
            loading.close()
            success.showModal()
        })
        .catch(error => {
            if(error.response.status === 422){
                setErrorMessage(error.response.data.errors)
            }else{
                errorModal.showModal()

            }
            loading.close()
        })
    }

    return (
        <>
            <dialog id="add_kamar_modal" className="modal">
                <div className="modal-box no-scrollbar">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className="items-center">
                            <h5 className="text-lg text-inherit text-center font-bold">Add Room</h5>

                                <div className="form-control w-auto">
                                    <input type="number" placeholder="Room's Number" className="input input-bordered text-center text-2xl font-bold" value={idKamar} onChange={(e)=> setId(e.target.value)}/>
                                    {
                                        idKamar === ''?
                                        <>
                                            {
                                                errorMessage && errorMessage.id ? <label className="label">
                                                <span className="label-text-alt text-red-600">{errorMessage.id}</span>
                                                </label> : ""
                                            }
                                        </>
                                        :""
                                    }
                                </div>


                        </div>
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">✕</button>
                    </form>
                    <h3 className="font-bold text-lg mt-1">Room Detail</h3>
                    <hr className="border-gray-300 my-1" />
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Status</span>
                        </label>
                        <select className="select select-bordered w-full" value={idStatus} onChange={(e)=>setStatus(e.target.value)}>
                            <option disabled>Select Room Status</option>
                            <option value={'1'}>Available</option>
                            <option value={'2'}>Booked</option>
                            <option value={'3'}>Maintenance</option>
                        </select>
                        {
                            errorMessage && errorMessage.id_jenis_kamar ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.id_jenis_kamar}</span>
                            </label> : ""
                        }
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Type</span>
                        </label>
                        <select className="select select-bordered w-full" value={tipe} onChange={(e)=>setTipe(e.target.value)}>
                            <option disabled>Select Room Type</option>
                            <option value={'1'}>Superior</option>
                            <option value={'2'}>Double Deluxe</option>
                            <option value={'3'}>Exclusive Deluxe</option>
                            <option value={'4'}>Junior Suite</option>
                        </select>
                        {
                            errorMessage && errorMessage.id_status_kamar ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.id_status_kamar}</span>
                            </label> : ""
                        }
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Bed Type</span>
                        </label>
                        <input type="text" placeholder="Type of Bed" className="input input-bordered w-full" value={tempatTidur} onChange={(e)=> setTempatTidur(e.target.value)}/>
                        {
                            tempatTidur === ''?
                            <>
                                {
                                    errorMessage && errorMessage.tempat_tidur ? <label className="label">
                                    <span className="label-text-alt text-red-600">{errorMessage.tempat_tidur}</span>
                                    </label> : ""   
                                }
                            </>
                            : ""
                        }
                    </div>
                    <hr className="my-5" />
                    <div className="grid grid-cols-2 gap-3">
                        <button className="btn btn-ghost" onClick={(e)=>document.getElementById('add_kamar_modal').close(e)}>Cancel</button>
                        <Link className="btn btn-success" onClick={(e)=>add(e)}>Save</Link>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            
            <dialog id="success_add_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Room Added</h3>
                    <p className="py-4">Your room added succesfully with number {idKamar}</p>
                    <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <a className="btn btn-primary" href="/room">Oke</a>
                    </form>
                    </div>
                </div>
            </dialog>
            <Error id="error_500_modal" title="Error" message={'Room with number '+idKamar+' already defined'} button="Oke" onClick={()=>document.getElementById('error_500_modal').close()}/>
        </>
    );
}

export default AddKamarModal;