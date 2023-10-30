import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SuccessModal from "../../successModal";
import Error500 from "../../errorHandling/error500";

function KamarDetailModal({id}) {
    const [idKamar, setId] = useState('')
    const [idStatus, setStatus] = useState('')
    const [tipe, setTipe] = useState('')
    const [tempatTidur, setTempatTidur] = useState('')
    const [deskripsi, setDeskripsi] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    const [kapasitas, setKapasitas] = useState('')
    const [rincian, setRincian] = useState('')
    const [errorMessage, setErrorMessage] = useState([])

    const getData = () => {
        const loading = document.getElementById('loading_modal')
        loading.showModal()

        axios.get('/kamar/'+id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setId(response.data.data.id)
            setStatus(response.data.data.id_status_kamar)
            setTipe(response.data.data.id_jenis_kamar)
            setTempatTidur(response.data.data.tempat_tidur)
            setDeskripsi(response.data.data.deskripsi)
            setRincian(response.data.data.rincian)
            setKapasitas(response.data.data.kapasitas)
        

            loading.close()
        })
        .catch(error => {
            loading.close()
        })
    }

    const edit = () => {
        const data = {
            id: idKamar,
            id_status_kamar: idStatus,
            id_jenis_kamar: tipe,
            tempat_tidur: tempatTidur,
            deskripsi: deskripsi,
            rincian: rincian,
            kapasitas: kapasitas,
        }

        const success = document.getElementById('success_modal')

        const loading = document.getElementById('loading_modal')
        const errorModal = document.getElementById('detail_error_modal')
        loading.showModal()

        axios.put('/kamar/'+id, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            console.log(response)
            loading.close()
            success.showModal()
        })
        .catch(error => {
            console.log(error)
            if(error.response.status === 422){
                setErrorMessage(error.response.data.errors)
            }else if(error.response.status === 500){
                errorModal.showModal()
            }
            loading.close()
        })
    }

    const deleteData = () => {
        const loading = document.getElementById('loading_modal')
        const modal = document.getElementById('delete_modal')
        loading.showModal()

        axios.delete('/kamar/'+id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            console.log(response.data.data)
            loading.close()
            modal.showModal()

        })
        .catch(error => {
            console.log(error.response)
            loading.close()
        })
    }

    useEffect(() => {
        getData()
    },[id])

    return (
        <>
            <dialog id="kamar_modal" className="modal">
                <div className="modal-box no-scrollbar">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className="items-center">
                            <h5 className="text-lg text-inherit text-center font-bold">Room</h5>
                            {
                                isEdit ?
                                <div className="form-control w-auto">
                                    <input type="text" placeholder="100" className="input input-bordered text-center text-2xl font-bold" value={idKamar} onChange={(e)=> setId(e.target.value)}/>
                                    {
                                        errorMessage && errorMessage.id ? <label className="label justify-center">
                                        <span className="label-text-alt text-red-600">{errorMessage.id}</span>
                                        </label> : ""
                                    }
                                </div>
                                :
                                <h5 className="text-3xl text-current font-extrabold text-center">{idKamar}</h5>
                            }

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
                        <select disabled={!isEdit} className="select select-bordered w-full" value={idStatus} onChange={(e)=>setStatus(e.target.value)}>
                            <option disabled>Select Room Status</option>
                            <option value={'1'}>Available</option>
                            <option value={'2'}>Booked</option>
                            <option value={'3'}>Maintenance</option>
                        </select>
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Type</span>
                        </label>
                        <select disabled={!isEdit} className="select select-bordered w-full" value={tipe} onChange={(e)=>setTipe(e.target.value)}>
                            <option disabled>Select Room Type</option>
                            <option value={'1'}>Superior</option>
                            <option value={'2'}>Double Deluxe</option>
                            <option value={'3'}>Exclusive Deluxe</option>
                            <option value={'4'}>Junior Suite</option>
                        </select>
                        {
                            errorMessage && errorMessage.jenis_identitas ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.jenis_identitas}</span>
                            </label> : ""
                        }
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Bed Type</span>
                        </label>
                        <input readOnly={!isEdit} type="text" placeholder="1 Twin" className="input input-bordered w-full" value={tempatTidur} onChange={(e)=> setTempatTidur(e.target.value)}/>
                        {
                            errorMessage && errorMessage.tempat_tidur && tempatTidur=="" ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.tempat_tidur}</span>
                            </label> : ""
                        }
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Capacity (People)</span>
                        </label>
                        <input readOnly={!isEdit} type="text" placeholder="2" className="input input-bordered w-full" value={kapasitas} onChange={(e)=> setKapasitas(e.target.value)}/>
                        {
                            errorMessage && errorMessage.kapasitas && kapasitas == '' ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.kapasitas}</span>
                            </label> : ""
                        }
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea readOnly={!isEdit} placeholder="Enter room's description" className="textarea textarea-bordered w-full" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}/>
                        {
                            errorMessage && errorMessage.deskripsi ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.deskripsi}</span>
                            </label> : ""
                        }
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Details</span>
                        </label>
                        <textarea readOnly={!isEdit} placeholder="Enter room's details" className="textarea textarea-bordered w-full" value={rincian} onChange={(e) => setRincian(e.target.value)}/>
                        {
                            errorMessage && errorMessage.rincian ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.rincian}</span>
                            </label> : ""
                        }
                    </div>
                    <hr className="my-5" />
                    {
                        isEdit ?
                        <div className="grid grid-cols-2 gap-3">
                            <Link className="btn btn-ghost" onClick={()=>setIsEdit(false)}>Cancel</Link>
                            <Link className="btn btn-success" onClick={(e)=>edit(e)}>Save</Link>
                        </div>
                        :
                        <div className="grid grid-cols-2 gap-3">
                            <Link className="btn btn-warning" onClick={(e)=>setIsEdit(true)}>Edit</Link>
                            <Link className="btn btn-error" onClick={()=>deleteData()}>Hapus</Link>
                        </div>
                    }

                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            <SuccessModal id="success_modal" title={'Room ' + idKamar + ' Edited'} button='Oke' message='Your room data edited' link='/room' onClick={()=>document.getElementById('kamar_modal').close()}/>
            <dialog id="detail_error_modal" className="modal">
                <div className="modal-box flex flex-col">
                    <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Room number has been assigned before</h3>
                    <p className="py-4">You cant have same room number, please choose another one</p>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button >Refresh Page</button>
                </form>
            </dialog>
            <dialog id="delete_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Room {idKamar} Deleted</h3>
                    <p className="py-4">Delete room succesfully</p>
                    <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <a className="btn btn-primary" href='/room' onClick={()=>document.getElementById('kamar_modal').close()}>Oke</a>
                    </form>
                    </div>
                </div>
            </dialog>
        </>
    );
}

export default KamarDetailModal;