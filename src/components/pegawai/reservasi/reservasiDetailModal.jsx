import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SuccessModal from "../../successModal";
import Error500 from "../../errorHandling/error500";
import Datepicker from "react-tailwindcss-datepicker";
import BookingStep from "../../bookingStep";

function ReservasiDetailModal({id}) {
    const [data, setData] = useState({})
    const [dataLayanan, setDataLayanan] = useState([])
    const [dataKamar, setDataKamar] = useState([])
    const [bookingDate, setBooking] = useState('')
    const [checkin, setCheckin] = useState('')
    const [checkout, setCheckout] = useState('')
    const [isLayananEmpty, setLayananEmpty] = useState(true)
    const [isInvoiceEmpty, setInvoiceEmpty] = useState(true)
    const [status, setStatus] = useState('1')

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
            const date = new Date(response.data.data.created_at)
            const checkin = new Date(response.data.data.check_in)
            const checkout = new Date(response.data.data.check_out)
            setBooking(date.toDateString() + " " + date.toString().split(" ")[4])
            setCheckin(checkin.toDateString())
            setCheckout(checkout.toDateString())
            if(response.data.data.id_uang_jaminan){
                setStatus('2')
            }
            if(response.data.data.id_deposit){
                setStatus('3')
            }
            if(response.data.data.id_transaksi){
                setStatus('4')
            }
            if(response.data.data.id_transaksi){
                setInvoiceEmpty(false)
            }

            // loading.close()
        })
        .catch(error => {
            // loading.close()
        })
    }

    const getKamar = () => {

        // loading.showModal()

        axios.get('/reservasi/'+id+'/kamar', {
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
    const getlayanan = () => {
        const loading = document.getElementById('loading_modal')

        // loading.showModal()

        axios.get('/reservasi/'+id+'/layanan', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if(response.data.data.length > 0){
                setDataLayanan(response.data.data)
                setLayananEmpty(false)
            }else{
                setLayananEmpty(true)
            }

            loading.close()
        })
        .catch(error => {
            loading.close()
        })
    }

    useEffect(() => {
        getData()
        getKamar()
        getlayanan()
    },[id])

    return (
        <>
            <dialog id="customer_modal" className="modal">
                <div className="modal-box no-scrollbar">
                <form method="dialog" className="flex justify-center items-center">
                        <div className="items-center">
                            <h5 className="text-xl text-inherit text-center font-bold">Reservation</h5>

                        </div>
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">✕</button>
                    </form>
                    <h3 className="font-bold text-lg mt-1">Reservation Detail</h3>
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
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            {/* head */}
                            <thead>
                            <tr>
                                <th>Room Type</th>
                                <th>Amount</th>
                                <th>Price</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                dataKamar ? dataKamar.map((data, index) => {
                                    return(
                                        <tr key={index}>
                                            <td>{data.nama_jenis_kamar}</td>
                                            <td>{data.jumlah}</td>
                                            <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.total_harga)}</td>
                                        </tr>
                                    )
                                }) : <tr><td colSpan="4">No Data</td></tr>
                            }
                            </tbody>
                        </table>
                    </div>
                    <h3 className="font-bold text-lg mt-5">Paid Services</h3>
                    <hr className="border-gray-300 my-2" />
                    <div className="overflow-x-auto">
                        {
                            isLayananEmpty ? <h5 className="text-sm text-current font-semibold text-center">No Data</h5> : 
                            <table className="table table-zebra">
                                {/* head */}
                                <thead>
                                <tr>
                                    <th>Service</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Price</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    dataLayanan ? dataLayanan.map((data, index) => {
                                        return(
                                            <tr key={index}>
                                                <td>{data.nama_fasilitas}</td>
                                                <td>{data.jumlah}</td>
                                                <td>{new Date(data.tgl_reservasi_fasilitas).toDateString()}</td>
                                                <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.sub_total_fasilitas)}</td>
                                            </tr>
                                        )
                                    }) : <tr><td colSpan="4">No Data</td></tr>
                                }
                                </tbody>
                            </table>
                        }
                    </div>
                    <div className="grid grid-cols-2 mt-5">
                        <h3 className="font-bold text-lg">Invoice</h3>
                        <h3 className="font-bold text-lg text-right">{}</h3>
                    </div>
                    <hr className="border-gray-300 my-2" />
                    {
                        isInvoiceEmpty ? <h5 className="text-sm text-current font-semibold text-center">No Data</h5> :
                        <div className="grid grid-cols-2 gap-2">
                            <h5 className="text-md text-inherit font-bold">Invoice Number</h5>
                            <h5 className="text-md text-current font-semibold">{data.id_transaksi}</h5>
                            <h5 className="text-md text-inherit font-bold">Transaction Date</h5>
                            <h5 className="text-md text-current font-semibold">{new Date(data.tgl_transaksi).toDateString() + " " + new Date(data.tgl_transaksi).toString().split(" ")[4]}</h5>
                            <h5 className="text-md text-inherit font-bold">Sub Total</h5>
                            <h5 className="text-md text-current font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.sub_total)}</h5>
                            <h5 className="text-md text-inherit font-bold">Tax</h5>
                            <h5 className="text-md text-current font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.pajak)}</h5>
                            <h5 className="text-md text-inherit font-bold">Total</h5>
                            <h5 className="text-md text-current font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.total_pembayaran) }</h5>
                        </div>
                    }
                    <div className="mt-5">
                        <BookingStep step={status} />
                    </div>
                </div>
            </dialog>
            <SuccessModal id="success_modal" title={'Season Edited Succesfully'} button='Oke' message='Your season data edited' link='/season' onClick={()=>document.getElementById('season_modal').close()}/>
        
        </>
    );
}

export default ReservasiDetailModal;