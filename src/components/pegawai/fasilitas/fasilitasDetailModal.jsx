import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SuccessModal from "../../successModal";
import Error500 from "../../errorHandling/error500";
import DeleteModal from "../../deleteModal";

function FasilitasDetailModal({id}) {
    const [harga, setHarga] = useState('')
    const [namaFasilitas, setNamaFasilitas] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    const [errorMessage, setErrorMessage] = useState([])

    const getData = () => {
        const loading = document.getElementById('loading_modal')
        loading.showModal()

        axios.get('/fasilitas/'+id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setNamaFasilitas(response.data.data.nama_fasilitas)
            setHarga(response.data.data.harga)
            loading.close()
        })
        .catch(error => {
            loading.close()
        })
    }

    const edit = () => {
        const data = {
            nama_fasilitas: namaFasilitas,
            harga: harga
        }

        const success = document.getElementById('success_modal')

        const loading = document.getElementById('loading_modal')
        const errorModal = document.getElementById('detail_error_modal')
        loading.showModal()

        axios.put('/fasilitas/'+id, data, {
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
            if(error.response?.status === 422){
                setErrorMessage(error.response.data.errors)
            }else if(error.response?.status === 500){
                errorModal.showModal()
            }
            loading.close()
        })
    }

    const deleteData = () => {
        const loading = document.getElementById('loading_modal')
        const modal = document.getElementById('success_modal')
        loading.showModal()

        axios.delete('/fasilitas/'+id, {
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
            <dialog id="fasilitas_modal" className="modal">
                <div className="modal-box no-scrollbar">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className="items-center">
                            <h5 className="text-xl text-inherit text-center font-bold">Season</h5>

                        </div>
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">✕</button>
                    </form>
                    <h3 className="font-bold text-lg mt-1">Fasilitas Detail</h3>
                    <hr className="border-gray-300 my-1" />

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Facility Name</span>
                        </label>
                        <input readOnly={!isEdit} type="text" placeholder="Laundry" className="input input-bordered w-full" value={namaFasilitas} onChange={(e)=> setNamaFasilitas(e.target.value)}/>
                        {
                            errorMessage && errorMessage.nama_fasilitas && namaFasilitas=="" ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.nama_fasilitas}</span>
                            </label> : ""
                        }
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Harga</span>
                        </label>
                        <input readOnly={!isEdit} type="text" placeholder="10000" className="input input-bordered w-full" value={harga} onChange={(e)=> setHarga(e.target.value)}/>
                        {
                            errorMessage && errorMessage.harga && harga == '' ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.harga}</span>
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
                            <Link className="btn btn-error" onClick={()=>document.getElementById('delete_modal').showModal()}>Hapus</Link>
                        </div>
                    }

                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            <SuccessModal id="success_modal" title={'Facility Deleted Succesfully'} button='Oke' message='Your facility data deleted' link='/facility' onClick={()=>document.getElementById('season_modal').close()}/>
            <DeleteModal id="delete_modal" title="Delete Fasility" message="Are you sure you want to delete this facility?" onClick={()=>deleteData()}/>
        </>
    );
}

export default FasilitasDetailModal;