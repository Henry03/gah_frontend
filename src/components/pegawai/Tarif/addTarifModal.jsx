import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SuccessModal from "../../successModal";
import Error500 from "../../errorHandling/error500";

function AddTarifModal() {
    const [idTarif, setId] = useState('')
    const [idJenisKamar, setIdJenisKamar] = useState('')
    const [idSeason, setIdSeason] = useState('')
    const [tarif, setTarif] = useState('')
    const [tipe, setTipe] = useState('')
    const [namaTarif, setNamaTarif] = useState('')
    const [tanggalMulai, setTanggalMulai] = useState('')
    const [tanggalSelesai, setTanggalSelesai] = useState('')
    const [errorMessage, setErrorMessage] = useState([])
    const [season, setSeason] = useState([])
    const [jenisKamar, setJenisKamar] = useState([])
    const [indexSeason, setIndexSeason] = useState('0')
    const [indexTipe, setIndexTipe] = useState('0')

    const add = (e) => {
        e.preventDefault()
        const data = {
            id_jenis_kamar: idJenisKamar,
            id_season: idSeason,
            tarif: tarif
        }

        const success = document.getElementById('success_add_modal')
        const errorModal = document.getElementById('error_500_modal')

        const loading = document.getElementById('loading_modal')
        loading.showModal()

        axios.post('/tarif', data, {
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
            if(error.response?.status === 422){
                setErrorMessage(error.response.data.errors)
            }else{
                console.log(error)
                errorModal.showModal()

            }
            loading.close()
        })
    }

    const getSeason = () => {
        axios.get('/season', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => {
            console.log(res.data.data)
            setSeason(res.data.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const getJenisKamar = () => {
        axios.get('/jenis-kamar', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => {
            console.log(res.data.data)
            setJenisKamar(res.data.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        getSeason()
        getJenisKamar()
    }, [])

    return (
        <>
            <dialog id="add_Tarif_modal" className="modal">
                <div className="modal-box no-scrollbar">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className="items-center">
                            <h5 className="text-lg text-inherit text-center font-bold">Add Tarif</h5>


                        </div>
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">✕</button>
                    </form>
                    <h3 className="font-bold text-lg mt-1">Tarif Detail</h3>
                    <hr className="border-gray-300 my-1" />
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Room Type</span>
                        </label>
                        <select className="select select-bordered w-full" value={idJenisKamar} onChange={(e)=>{setIdJenisKamar(e.target.value);setIndexTipe(--e.target.selectedIndex)}}>
                            <option disabled hidden value="">Select Tarif Type</option>
                            <option value={'1'}>Superior</option>
                            <option value={'2'}>Double Deluxe</option>
                            <option value={'3'}>Exclusive Deluxe</option>
                            <option value={'4'}>Junior Suite</option>
                        </select>
                        {
                            errorMessage && errorMessage.id_jenis_kamar ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.id_jenis_kamar}</span>
                            </label> : ""
                        }
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Season</span>
                        </label>
                        <select className="select select-bordered w-full" value={idSeason} onChange={(e)=>{setIdSeason(e.target.value);setIndexSeason(--e.target.selectedIndex)}}>
                            <option disabled hidden value="">Select Tarif Type</option>
                            {
                                season.map((item, index) => {
                                    return(
                                        <option key={index} value={item.id}>{item.nama_season}</option>
                                    )
                                })
                            }
                        </select>
                        {
                            errorMessage && errorMessage.id_season ? <label className="label">
                            <span className="label-text-alt text-red-600">{errorMessage.id_season}</span>
                            </label> : ""
                        }
                    </div>
                    {
                        idSeason == "" ? "" : 
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Start Date</span>
                                </label>
                                <input disabled type="text" placeholder="Start Date" className="input input-bordered w-full" value={new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium'}).format(new Date(season[indexSeason].tanggal_mulai))}/>
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Finish Date</span>
                                </label>
                                <input disabled type="text" placeholder="Start Date" className="input input-bordered w-full" value={new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium'}).format(new Date(season[indexSeason].tanggal_selesai))}/>
                            </div>
                        </div>
                    }
                    <div className="flex gap-4">
                        {
                            idJenisKamar == "" ? "" :
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Default Price</span>
                                </label>
                                <input disabled type="text" placeholder="100000" className="input input-bordered w-full" value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(jenisKamar[indexTipe].harga)}/>
                            </div>
                        }
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Price Change</span>
                            </label>
                            <input type="text" placeholder="100000" className="input input-bordered w-full" value={tarif} onChange={(e)=> setTarif(e.target.value)}/>
                            {
                                errorMessage && errorMessage.tarif && tarif=="" ? <label className="label">
                                <span className="label-text-alt text-red-600">{errorMessage.tarif}</span>
                                </label> : ""
                            }
                        </div>
                    </div>
                    <hr className="my-5" />
                    <div className="grid grid-cols-2 gap-3">
                        <button className="btn btn-ghost" onClick={(e)=>document.getElementById('add_Tarif_modal').close(e)}>Cancel</button>
                        <Link className="btn btn-success" onClick={(e)=>add(e)}>Save</Link>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            
            <dialog id="success_add_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Tarif Added</h3>
                    <p className="py-4">Your Tarif added succesfully with type {tipe}</p>
                    <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <a className="btn btn-primary" href="/Tarif">Oke</a>
                    </form>
                    </div>
                </div>
            </dialog>
            <Error500 id="error_500_modal" title="Error" message={'Something went wrong, please contact us support@gah.com'}/>
        </>
    );
}

export default AddTarifModal;