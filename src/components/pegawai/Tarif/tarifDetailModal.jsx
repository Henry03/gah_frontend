import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SuccessModal from "../../successModal";
import Error500 from "../../errorHandling/error500";
import DeleteModal from "../../deleteModal";

function TarifDetailModal({id}) {
    const [season, setSeason] = useState([])
    const [jenisKamar, setJenisKamar] = useState([])
    const [indexSeason, setIndexSeason] = useState('0')
    const [indexTipe, setIndexTipe] = useState('0')
    const [idJenisKamar, setIdJenisKamar] = useState('')
    const [idSeason, setIdSeason] = useState('')
    const [tarif, setTarif] = useState('')
    const [namaTarif, setNamaTarif] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    const [errorMessage, setErrorMessage] = useState([])

    const getData = () => {
        const loading = document.getElementById('loading_modal')
        loading.showModal()

        axios.get('/tarif/'+id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setIdJenisKamar(response.data.data.id_jenis_kamar)
            setIdSeason(response.data.data.id_season)
            setTarif(response.data.data.tarif)
            setNamaTarif(response.data.data.nama_Tarif)
            loading.close()
        })
        .catch(error => {
            loading.close()
        })
    }

    const getSeason = () => {
        axios.get('/all/season', {
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


    const edit = () => {
        const data = {
            id_jenis_kamar: idJenisKamar,
            id_season: idSeason,
            tarif: tarif
        }

        const success = document.getElementById('success_modal')

        const loading = document.getElementById('loading_modal')
        const errorModal = document.getElementById('detail_error_modal')
        loading.showModal()

        axios.put('/tarif/'+id, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            loading.close()
            success.showModal()
        })
        .catch(error => {
            if(error.response.status === 422){
                setErrorMessage(error.response.data.errors)
            }else if(error.response.status === 500){
                errorModal.showModal()
            }
            loading.close()
        })
    }

    const deleteData = (e) => {
        e.preventDefault()
        const loading = document.getElementById('loading_modal')
        const success = document.getElementById('success_delete_modal')
        loading.showModal()

        axios.delete('/tarif/'+id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            loading.close()
            success.showModal()

        })
        .catch(error => {
            loading.close()
        })
    }

    const getJenisKamar = () => {
        axios.get('/jenis-kamar', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => {
            setJenisKamar(res.data.data)
        })
        .catch((err) => {
        })
    }

    useEffect(() => {
        const getThisSeasonIndex = season.findIndex((item) => item.id == idSeason)
        setIndexSeason(getThisSeasonIndex)
        console.log("index", getThisSeasonIndex)
    },[idSeason, season])

    useEffect(() => {
        getData()
        getSeason()
        getJenisKamar()
    },[id])

    return (
        <>
            <dialog id="Tarif_modal" className="modal">
                <div className="modal-box no-scrollbar">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className="items-center">
                            <h5 className="text-xl text-inherit text-center font-bold">Tarif</h5>

                        </div>
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">✕</button>
                    </form>
                    <h3 className="font-bold text-lg mt-1">Tarif Detail</h3>
                    {idSeason}
                    <hr className="border-gray-300 my-1" />

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Room Type</span>
                        </label>
                        <select disabled={!isEdit} className="select select-bordered w-full" value={idJenisKamar} onChange={(e)=>{setIdJenisKamar(e.target.value);setIndexTipe(--e.target.selectedIndex)}}>
                            <option disabled>Select Tarif Type</option>
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
                        <select disabled={!isEdit} className="select select-bordered w-full" value={idSeason} onChange={(e)=>{setIdSeason(e.target.value);setIndexSeason(--e.target.selectedIndex)}}>
                            <option disabled>Select Tarif Type</option>
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
                                <input disabled type="text" placeholder="Start Date" className="input input-bordered w-full" value={season[indexSeason] ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium'}).format(new Date(season[indexSeason].tanggal_mulai)):""}/>
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Finish Date</span>
                                </label>
                                <input disabled type="text" placeholder="Start Date" className="input input-bordered w-full" value={season[indexSeason]?new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium'}).format(new Date(season[indexSeason].tanggal_selesai)):""}/>
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
                                <input disabled type="text" placeholder="100000" className="input input-bordered w-full" value={jenisKamar[indexTipe] ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(jenisKamar[indexTipe].harga):""}/>
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
            <SuccessModal id="success_modal" title={'Tarif Edited Succesfully'} button='Oke' message='Your Tarif data edited' link='/Tarif' onClick={()=>document.getElementById('Tarif_modal').close()}/>
            <SuccessModal id="success_delete_modal" title={'Delete Tarif'} button='Oke' message='Your Tarif data deleted successfully' link='/Tarif' onClick={()=>document.getElementById('Tarif_modal').close()}/>
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


            <DeleteModal id="delete_modal" title="Delete Price" message="Are you sure you want to delete this price?" onClick={(e)=>deleteData(e)}/>
        </>
    );
}

export default TarifDetailModal;