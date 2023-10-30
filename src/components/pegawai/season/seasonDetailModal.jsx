import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SuccessModal from "../../successModal";
import Error500 from "../../errorHandling/error500";
import Datepicker from "react-tailwindcss-datepicker";

function SeasonDetailModal({id}) {
    const [idSeason, setId] = useState('')
    const [tipe, setTipe] = useState('')
    const [namaSeason, setNamaSeason] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    const [errorMessage, setErrorMessage] = useState([])

    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 3).padStart(2, '0'); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');

    const [tanggalMulai, setTanggalMulai] = useState({ 
        startDate: null,
        endDate: null 
        }); 
    const [tanggalSelesai, setTanggalSelesai] = useState({ 
        startDate: null,
        endDate: null 
        }); 
        
    const handleTanggalMulaiChange = (newValue) => {
        setTanggalMulai(newValue); 
        } 
    const handleTanggalSelesaiChange = (newValue) => {
        setTanggalSelesai(newValue); 
        } 

    const getData = () => {
        const loading = document.getElementById('loading_modal')
        loading.showModal()

        axios.get('/season/'+id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setId(response.data.data.id)
            setTipe(response.data.data.tipe_season)
            setNamaSeason(response.data.data.nama_season)
            setTanggalMulai({startDate: response.data.data.tanggal_mulai, endDate: response.data.data.tanggal_mulai})
            setTanggalSelesai({startDate: response.data.data.tanggal_selesai, endDate: response.data.data.tanggal_selesai})

            loading.close()
        })
        .catch(error => {
            loading.close()
        })
    }

    const edit = () => {
        const data = {
            id: idSeason,
            tipe_season: tipe,
            nama_season: namaSeason,
            tanggal_mulai: tanggalMulai,
            tanggal_selesai: tanggalSelesai
        }

        const success = document.getElementById('success_modal')

        const loading = document.getElementById('loading_modal')
        const errorModal = document.getElementById('detail_error_modal')
        loading.showModal()

        axios.put('/season/'+id, data, {
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

        axios.delete('/season/'+id, {
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
            <dialog id="season_modal" className="modal">
                <div className="modal-box no-scrollbar overflow-visible">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className="items-center">
                            <h5 className="text-xl text-inherit text-center font-bold">Season</h5>

                        </div>
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">✕</button>
                    </form>
                    <h3 className="font-bold text-lg mt-1">Season Detail</h3>
                    <hr className="border-gray-300 my-1" />

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Type</span>
                        </label>
                        <select disabled={!isEdit} className="select select-bordered w-full" value={tipe} onChange={(e)=>setTipe(e.target.value)}>
                            <option disabled>Select Season Type</option>
                            <option value={'Promo'}>Promo</option>
                            <option value={'Normal'}>Normal</option>
                            <option value={'High Season'}>High Season</option>
                        </select>
                        {
                            errorMessage && errorMessage.tipe_season && tipe == "" ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.tipe_season}</span>
                            </label> : ""
                        }
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Season Name</span>
                        </label>
                        <input readOnly={!isEdit} type="text" placeholder="1 Twin" className="input input-bordered w-full" value={namaSeason} onChange={(e)=> setNamaSeason(e.target.value)}/>
                        {
                            errorMessage && errorMessage.nama_season && namaSeason=="" ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.nama_season}</span>
                            </label> : ""
                        }
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Start Date</span>
                        </label>
                        <Datepicker inputClassName="input input-bordered w-full"
                            minDate={year + '-' + month + '-' + day} 
                            value={tanggalMulai} 
                            placeholder='Input start date'
                            startFrom={year + '-' + month + '-' + day} 
                            useRange={false}
                            asSingle={true}
                            displayFormat='D MMM YYYY'
                            popoverDirection="up" 
                            onChange={handleTanggalMulaiChange} 
                                    /> 
                        {
                            errorMessage && errorMessage.tanggal_mulai ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.tanggal_mulai}</span>
                            </label> : ""
                        }
                    </div>
                    {
                        tanggalMulai.startDate == null ? "" :
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Finish Date</span>
                            </label>
                            <Datepicker inputClassName="input input-bordered w-full"
                                minDate={tanggalMulai.startDate} 
                                popoverDirection="up" 
                                value={tanggalSelesai} 
                                placeholder='Input start date'
                                startFrom={tanggalMulai.startDate} 
                                useRange={false}
                                asSingle={true}
                                displayFormat='D MMM YYYY'
                                onChange={handleTanggalSelesaiChange} 
                                        /> 
                            {
                                errorMessage && errorMessage.tanggal_selesai ? <label className="label">
                                <span className="label-text-alt text-red-600">{errorMessage.tanggal_selesai}</span>
                                </label> : ""
                            }
                        </div>
                    }

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
            <SuccessModal id="success_modal" title={'Season Edited Succesfully'} button='Oke' message='Your season data edited' link='/season' onClick={()=>document.getElementById('season_modal').close()}/>
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
                    <h3 className="font-bold text-lg">Season {namaSeason} Deleted</h3>
                    <p className="py-4">Delete season succesfully</p>
                    <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <a className="btn btn-primary" href='/season' onClick={()=>document.getElementById('season_modal').close()}>Oke</a>
                    </form>
                    </div>
                </div>
            </dialog>
        </>
    );
}

export default SeasonDetailModal;