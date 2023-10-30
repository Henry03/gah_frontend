import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SuccessModal from "../../successModal";
import Error500 from "../../errorHandling/error500";

function AddFasilitasModal() {
    const [harga, setHarga] = useState('')
    const [namaFasilitas, setNamaFasilitas] = useState('')
    const [errorMessage, setErrorMessage] = useState([])

    const add = (e) => {
        e.preventDefault()
        const data = {
            nama_fasilitas: namaFasilitas,
            harga: harga
        }

        const success = document.getElementById('success_add_modal')
        const errorModal = document.getElementById('error_500_modal')

        const loading = document.getElementById('loading_modal')
        loading.showModal()

        axios.post('/fasilitas', data, {
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
                console.log(error)
                errorModal.showModal()

            }
            loading.close()
        })
    }

    return (
        <>
            <dialog id="add_fasilitas_modal" className="modal">
                <div className="modal-box no-scrollbar">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className="items-center">
                            <h5 className="text-lg text-inherit text-center font-bold">Add Season</h5>


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
                        <input type="text" placeholder="Laundry" className="input input-bordered w-full" value={namaFasilitas} onChange={(e)=> setNamaFasilitas(e.target.value)}/>
                        {
                            errorMessage && errorMessage.nama_fasilitas && namaFasilitas=="" ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.nama_fasilitas}</span>
                            </label> : ""
                        }
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Price /item</span>
                        </label>
                        <input type="text" placeholder="Enter Start Date" className="input input-bordered w-full" value={harga} onChange={(e)=> setHarga(e.target.value)}/>
                        {
                            errorMessage && errorMessage.harga && harga=="" ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.harga}</span>
                            </label> : ""
                        }
                    </div>
                    <hr className="my-5" />
                    <div className="grid grid-cols-2 gap-3">
                        <button className="btn btn-ghost" onClick={(e)=>document.getElementById('add_season_modal').close(e)}>Cancel</button>
                        <Link className="btn btn-success" onClick={(e)=>add(e)}>Save</Link>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            <SuccessModal id="success_add_modal" title="Success" message={'Season has been added successfully'} link={'/facility'} button="Sip"/>
            <Error500 id="error_500_modal" title="Error" message={'Something went wrong, please contact us support@gah.com'}/>
        </>
    );
}

export default AddFasilitasModal;