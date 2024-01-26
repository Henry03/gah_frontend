import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingModal from "../../LoadingModal";
import SuccessModal from "../../successModal";
import BookingStep from "../../bookingStep";
import PaymentModal from "./paymentGrupModal";

function TransactionGrupDetailModal({id}) {
    const [data, setData] = useState({})
    const [dataLayanan, setDataLayanan] = useState([])
    const [dataKamar, setDataKamar] = useState([])
    const [bookingDate, setBooking] = useState('')
    const [checkin, setCheckin] = useState('')
    const [checkout, setCheckout] = useState('')
    const [isLayananEmpty, setLayananEmpty] = useState(true)
    const [isInvoiceEmpty, setInvoiceEmpty] = useState(false)
    const [status, setStatus] = useState('1')
    const [total, setTotal] = useState(0)
    

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
            
            setStatus('1')
            setInvoiceEmpty(false)
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

    const getTotal = () => {
        let total = 0
        dataKamar.map((data) => {
            console.log(data.total_harga, data.jumlah)
            total += data.total_harga * data.jumlah
        })
        dataLayanan.map((data) => {
            total += data.sub_total_fasilitas
        })
        setTotal(total)
    }

    const payment = () => {
        const paymentModal = document.getElementById('payment_modal')
        const TransactionDetailModal = document.getElementById('transaction_detail_modal')
        TransactionDetailModal.close()
        paymentModal.showModal()
    }

    useEffect(()=> {
        if(dataKamar && dataLayanan)
        getTotal()
    },[dataKamar, dataLayanan])
    
    useEffect(() => {
        console.log(id)
        getData()
        getKamar()
        getlayanan()   
    },[id])

    return (
        <>
            <dialog id="transaction_detail_modal" className="modal">
                <div className="modal-box no-scrollbar justi">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className=" flex flex-col items-center justify-center">
                            <h5 className="text-lg text-inherit text-center font-bold">Booking Date</h5>
                            <h5 className="text-md text-current font-semibold">{bookingDate}</h5>
                            {
                                data.status_reservasi === 'Waiting for Payment' ? <span className="badge badge-warning m-2">{data.status_reservasi}</span>
                                : <span className="badge badge-success m-2">{data.status_reservasi}</span>
                            }

                        </div>
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Booking Detail</h3>
                    <hr className="border-gray-300 my-2" />
                    <div className="grid grid-cols-2 gap-2">
                        <h5 className="text-md text-inherit font-bold">ID Booking</h5>
                        <h5 className="text-md text-current font-semibold">{data.id_booking}</h5>
                        <h5 className="text-md text-inherit font-bold">Customer Name</h5>
                        <h5 className="text-md text-current font-semibold">{data.name}</h5>
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
                                <th>Sub Total</th>
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
                                            <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.jumlah * data.total_harga)}</td>
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
                    {
                        isInvoiceEmpty ? 
                        <>
                            <div className="grid grid-cols-2 mt-5">
                                <h3 className="font-bold text-lg">Invoice</h3>
                                <h3 className="font-bold text-lg text-right">{}</h3>
                            </div>
                            <hr className="border-gray-300 my-2" />
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
                        </>
                    :""
                    }
                    {
                        status === '1' ?
                        <div className="mt-5">
                            <button className="btn btn-primary w-full" onClick={payment}>Pay Now {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)}</button>
                        </div>: ""
                    }
                    <div className="mt-5">
                        <BookingStep step={status} />
                    </div>
                </div>
            </dialog>
            <LoadingModal />
            <PaymentModal id={id} total={total}/>
        </>
    );
}

export default TransactionGrupDetailModal;