import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingModal from "../../LoadingModal";
import SuccessModal from "../../successModal";
import BookingStep from "../../home/bookingStep";
import PaymentModal from "../../home/paymentModal";
import TwoButton from "../../errorHandling/twoButton";
import ReservasiStatusLabel from "../../home/reservasiStatusLabel";
import Success from "../../errorHandling/success";

function AddBookingKamarModal({id, refreshData, fetchData}) {
    const [data, setData] = useState({})
    const [dataLayanan, setDataLayanan] = useState([])
    const [dataKamar, setDataKamar] = useState([])
    const [dataJumlahKamar, setDataJumlahKamar] = useState([])
    const [bookingDate, setBooking] = useState('')
    const [checkin, setCheckin] = useState('')
    const [checkout, setCheckout] = useState('')
    const [status, setStatus] = useState('1')
    const [total, setTotal] = useState(0)
    const [message, setMessage] = useState('')
    const [kamar, setKamar] = useState([])

    const getData = () => {
        const loading = document.getElementById('loading_modal')
        loading.showModal()

        axios.get('/reservasi/'+id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setData(response.data.data)
            console.log(response.data.data)
            const date = new Date(response.data.data.created_at)
            const checkin = new Date(response.data.data.check_in)
            const checkout = new Date(response.data.data.check_out)
            
            setBooking(date.toDateString() + " " + date.toString().split(" ")[4])
            setCheckin(checkin.toDateString())
            setCheckout(checkout.toDateString())
            
            setStatus('1')
            if(response.data.data.id_uang_jaminan != null){
                setStatus('2')
            }
            if(response.data.data.id_deposit != null){
                console.log(response.data.data.id_deposit)
                setStatus('3')
            }
            if(response.data.data.id_transaksi != null){
                console.log(response.data.data.id_transaksi)
                setStatus('4')
                setInvoiceEmpty(true)
            }

            loading.close()
        })
        .catch(error => {
            loading.close()
        })
    }

    const getKamar = () => {

        // loading.showModal()

        axios.get('/kamar', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setDataKamar(response.data.data)

            // loading.close()
        })
        .catch(error => {
            // loading.close()
        })
    }

    const getJumlahKamar = () => {
        const loading = document.getElementById('loading_modal')
        loading.showModal()

        axios.post('/reservasi/jumlah-kamar/', {id_reservasi:id}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            console.log(response)
            setDataJumlahKamar(response.data.jumlah_kamar)
            loading.close()
        })
        .catch(error => {
            loading.close()
        })
    }

    const checkIn = () => {
        const loading = document.getElementById('loading_modal')
        const successModal = document.getElementById('success_add_modal')
        const TransactionDetailModal = document.getElementById('transaction_detail_modal')
        loading.showModal()

        const data = {
            id: id,
            kamar: kamar
        }

        axios.put('/reservasi/checkin', data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            console.log(response)
            loading.close()
            setMessage("Check In Success")
            successModal.showModal()
            TransactionDetailModal.close()
        })
        .catch(error => {
            loading.close()
            console.log(error)
        })
    }

    const kamarHandler = (id) => {
        const updatedKamar = [...kamar]
        if(updatedKamar.includes(id)){
            const index = updatedKamar.indexOf(id)
            updatedKamar.splice(index, 1)
        }else{
            updatedKamar.push(id)
        }
        setKamar(updatedKamar)
    }

    const isKamarSelected = (id) => {
        if(kamar.includes(id)){
            return true
        }
        return false
    }

    const fetchDataParent = () => {
        const success = document.getElementById('success_add_modal')
        const addBookingKamarModal = document.getElementById('add_booking_kamar_modal')
        
        refreshData();
        fetchData();

        success.close()
        addBookingKamarModal.close()
    }
    useEffect(() => {
        setKamar([])
    },[])
    
    useEffect(() => {
        if(id){
            getData()
            getKamar()
            getJumlahKamar()
        }
    },[id])

    return (
        <>
            <dialog id="add_booking_kamar_modal" className="modal">
                <div className="modal-box no-scrollbar justi">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className=" flex flex-col items-center justify-center">
                            <h5 className="text-lg text-inherit text-center font-bold">Booking Date</h5>
                            <h5 className="text-md text-current font-semibold">{bookingDate}</h5>
                            <ReservasiStatusLabel status={data.status_reservasi} />

                        </div>
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Booking Detail</h3>
                    <hr className="border-gray-300 my-2" />
                    <div className="grid grid-cols-2 gap-2">
                        <h5 className="text-md text-inherit font-bold">ID Booking</h5>
                        <h5 className="text-md text-current font-semibold">{data.id_booking}</h5>
                        <h5 className="text-md text-inherit font-bold">Check In</h5>
                        <h5 className="text-md text-current font-semibold">{checkin}</h5>
                        <h5 className="text-md text-inherit font-bold">Check Out</h5>
                        <h5 className="text-md text-current font-semibold">{checkout}</h5>
                        <h5 className="text-md text-inherit font-bold">Guest</h5>
                        <h5 className="text-md text-current font-semibold">{data.jumlah_dewasa} Adults, {data.jumlah_anak} Children</h5>
                    </div>
                    <h3 className="font-bold text-lg mt-5">Room Detail</h3>
                    <hr className="border-gray-300 my-2" />
                    <div className="grid grid-cols-2 gap-2">
                        {
                            dataJumlahKamar.map((data, index) => {
                                return(
                                    <div key={index}>
                                        <h5 className="text-md text-inherit font-bold">{data.nama_jenis_kamar}</h5>
                                        <h5 className="text-md text-current font-semibold">{data.jumlah}</h5>
                                    </div>
                                )
                            })
                        }
                    
                    </div>
                    <h3 className="font-bold text-lg mt-5">Choose Room</h3>
                    <hr className="border-gray-300 my-2" />
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            {/* head */}
                            <thead>
                            <tr>
                                <th></th>
                                <th>Room Number</th>
                                <th>Room Type</th>
                                <th>Bed Type</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                dataKamar ? dataKamar.map((data, index) => {
                                    return(
                                        <tr key={index}>
                                            <th>
                                                <label>
                                                    <input type="checkbox" className="checkbox" onClick={() => kamarHandler(data.id)} checked={isKamarSelected(data.id)}/>
                                                </label>
                                            </th>
                                            <td>{data.id}</td>
                                            <td>{data.jenis_kamar.nama_jenis_kamar}</td>
                                            <td>{data.tempat_tidur}</td>
                                            
                                        </tr>
                                    )
                                }) : <tr><td colSpan="4">No Data</td></tr>
                            }
                            </tbody>
                        </table>
                    </div>
                    {
                        status === '2' && data.status_reservasi != 'Canceled' && kamar.length != 0?
                        <div className="mt-5">
                            <button className="btn btn-primary w-full" onClick={checkIn}>Confirm</button>
                        </div>
                        :
                        <div className="mt-5">
                            <button className="btn btn-primary w-full" disabled>Confirm</button>
                        </div>
                    }
                </div>
            </dialog>
            
            <Success id="success_add_modal" title="Success" message={message} button="OK" onClick={()=>{fetchDataParent()}} hideCloseButton={true}/>
        </>
    );
}

export default AddBookingKamarModal;