import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SuccessModal from "../../successModal";
import Error500 from "../../errorHandling/error500";
import Datepicker from "react-tailwindcss-datepicker";

function AddSeasonModal() {
    const [tipe, setTipe] = useState('')
    const [namaSeason, setNamaSeason] = useState('')
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

    const add = (e) => {
        e.preventDefault()
        const data = {
            tipe_season: tipe,
            nama_season: namaSeason,
            tanggal_mulai: tanggalMulai.startDate,
            tanggal_selesai: tanggalSelesai.endDate
        }

        const success = document.getElementById('success_add_modal')
        const errorModal = document.getElementById('error_500_modal')

        const loading = document.getElementById('loading_modal')
        loading.showModal()

        axios.post('/season', data, {
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
            <dialog id="add_season_modal" className="modal">
                <div className="modal-box no-scrollbar overflow-visible">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className="items-center">
                            <h5 className="text-lg text-inherit text-center font-bold">Add Season</h5>


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
                        <select className="select select-bordered w-full" value={tipe} onChange={(e)=>setTipe(e.target.value)}>
                            <option disabled value="" selected>Select Season Type</option>
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
                        <input type="text" placeholder="New year" className="input input-bordered w-full" value={namaSeason} onChange={(e)=> setNamaSeason(e.target.value)}/>
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
                    <div className="grid grid-cols-2 gap-3">
                        <button className="btn btn-ghost" onClick={(e)=>document.getElementById('add_season_modal').close(e)}>Cancel</button>
                        <Link className="btn btn-success" onClick={(e)=>add(e)}>Save</Link>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            
            <dialog id="success_add_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Season Added</h3>
                    <p className="py-4">Your season added succesfully with type {tipe}</p>
                    <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <a className="btn btn-primary" href="/season">Oke</a>
                    </form>
                    </div>
                </div>
            </dialog>
            <Error500 id="error_500_modal" title="Error" message={'Something went wrong, please contact us support@gah.com'}/>
        </>
    );
}

export default AddSeasonModal;