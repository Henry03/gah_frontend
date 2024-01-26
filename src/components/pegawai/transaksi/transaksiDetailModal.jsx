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
import AddBookingKamarModal from "./addBookingKamarModal";
import AddBookingFasilitasModal from "./addBookingFasilitasModal";
import CheckoutDetailModal from "./checkoutDetailModal";

function TransaksiDetailModal({id, setId, fetchData}) {
    const [data, setData] = useState({})
    const [dataLayanan, setDataLayanan] = useState([])
    const [dataKamar, setDataKamar] = useState([])
    const [bookingDate, setBooking] = useState('')
    const [checkin, setCheckin] = useState('')
    const [checkout, setCheckout] = useState('')
    const [isLayananEmpty, setLayananEmpty] = useState(true)
    const [isInvoiceEmpty, setInvoiceEmpty] = useState(false)
    const [status, setStatus] = useState('1')
    const [totalKamar, setTotalKamar] = useState(0)
    const [totalFasilitas, setTotalFasilitas] = useState(0)
    const [message, setMessage] = useState('')
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const now = new Date()
    const [checkinDate, setCheckinDate] = useState('')
    const [checkoutDate, setCheckoutDate] = useState('')
    

    

    const getData = () => {
        const loading = document.getElementById('loading')
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
            setCheckin(checkin.toDateString() + " " + checkin.toString().split(" ")[4])
            setCheckout(checkout.toDateString() + " " + checkout.toString().split(" ")[4])
            setCheckinDate(checkin)
            setCheckoutDate(checkout)
            console.log(now, checkin)
            if(now <= checkin){
                setDays(Math.floor((checkin - now) / (1000 * 60 * 60 * 24)))
                setHours(Math.floor((checkin - now) / (1000 * 60 * 60) % 24))
                setMinutes(Math.floor((checkin - now) / (1000 * 60) % 60))
                setSeconds(Math.floor((checkin - now) / (1000) % 60))
            }
            
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
        })
        .catch(error => {
        })
    }

    const getKamar = () => {
        const loading = document.getElementById('loading')
        loading.showModal()

        axios.get('/reservasi/'+id+'/kamar', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setDataKamar(response.data.data)
        })
        .catch(error => {
        })
    }
    const getlayanan = () => {
        const loading = document.getElementById('loading')
        loading.showModal()

        const request = axios.get('/reservasi/'+id+'/layanan', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if(response.data.data.length > 0){
                
                setLayananEmpty(false)
            }else{
                setLayananEmpty(true)
            }
            setDataLayanan(response.data.data)
        })
        .catch(error => {
        })
    }

    const getTotalKamar = () => {
        let total = 0
        dataKamar.map((data) => {
            console.log(data.total_harga, data.jumlah)
            total += data.total_harga * data.jumlah
        })
        console.log(total)
        setTotalKamar(total)
    }

    const getTotalLayanan = () => {
        let total = 0
        dataLayanan.map((data) => {
            total += data.sub_total_fasilitas
        })
        setTotalFasilitas(total)
    }

    const checkInHandle = () => {
        const checkInModal = document.getElementById('add_booking_kamar_modal')
        const transaksiDetailModal = document.getElementById('transaction_detail_modal')
        transaksiDetailModal.close()
        checkInModal.showModal()
    }

    const fasilityHandle = () => {
        const fasilitasModal = document.getElementById('add_booking_fasilitas_modal')
        const transaksiDetailModal = document.getElementById('transaction_detail_modal')
        transaksiDetailModal.close()
        fasilitasModal.showModal()
    }

    const checkoutHandle = () => {
        const checkoutModal = document.getElementById('checkout_detail_modal')
        const transaksiDetailModal = document.getElementById('transaction_detail_modal')
        transaksiDetailModal.close()
        checkoutModal.showModal()
    }

    const invoice = async() => {
        const printLoading = document.getElementById('loading_modal')
        printLoading.showModal()

        try{
            const response = await fetch('http://localhost:8000/api/invoice/'+id, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    Accept: 'application/pdf'
                },
                responseType: 'blob'
            })
            
            printLoading.close()
            // console.log(response.blob())
            const blob = await response.blob()
            console.log(response)
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'invoice.pdf'
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(url)
        }
        catch(error){
            printLoading.close()
            console.log(error)
        }

    }

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 59));
        
            if (seconds === 0) {
                setMinutes((prevMinutes) => (prevMinutes > 0 ? prevMinutes - 1 : 59));
                setSeconds(59);
            }
        
            if (minutes === 0 && seconds === 0) {
                setHours((prevHours) => (prevHours > 0 ? prevHours - 1 : 23));
                setMinutes(59);
            }
        
            if (hours === 0 && minutes === 0 && seconds === 0) {
                setDays((prevDays) => (prevDays > 0 ? prevDays - 1 : 0));
                setHours(23);
            }
        }, 1000);
    
        return () => clearInterval(interval);
      }, [days, hours, minutes, seconds]);

    useEffect(()=> {
        if(dataKamar){
            getTotalKamar()
        }
        if(dataLayanan){
            getTotalLayanan()
        }
    },[dataKamar, dataLayanan])

    const refreshData = () => {
        getData()
        getKamar()
        getlayanan()
    }

    useEffect(() => {
        if(id){
            getData()
            getKamar()
            getlayanan()
        }
    },[id])
    
    useEffect(() => {
        if(data && dataKamar && dataLayanan && totalKamar != 0 && totalFasilitas != 0){
            const loading = document.getElementById('loading')
            loading.close();
        }
    },[data, dataKamar, dataLayanan, totalKamar, totalFasilitas])

    return (
        <>
            <dialog id="transaction_detail_modal" className="modal">
                <div className="modal-box no-scrollbar justi">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className=" flex flex-col items-center justify-center">
                            <h5 className="text-lg text-inherit text-center font-bold">Booking Date</h5>
                            <h5 className="text-md text-current font-semibold">{bookingDate}</h5>
                            <ReservasiStatusLabel status={data.status_reservasi} />
                            {
                                data.id_uang_jaminan != null && now <= checkinDate ?
                                <div className="my-2 p-2 bg-base-300 rounded-box flex flex-col items-center">
                                
                                    <p className="text-md font-semibold">Before Check In</p>
        
                                    <div className="grid grid-flow-col gap-5 text-center auto-cols-max  ">
                                        <div className="flex flex-col">
                                            <span className="countdown font-mono text-5xl">
                                            <span style={{"--value":days}}></span>
                                            </span>
                                            days
                                        </div> 
                                        <div className="flex flex-col">
                                            <span className="countdown font-mono text-5xl">
                                            <span style={{"--value":hours}}></span>
                                            </span>
                                            hours
                                        </div> 
                                        <div className="flex flex-col">
                                            <span className="countdown font-mono text-5xl">
                                            <span style={{"--value":minutes}}></span>
                                            </span>
                                            min
                                        </div> 
                                        <div className="flex flex-col">
                                            <span className="countdown font-mono text-5xl">
                                            <span style={{"--value":seconds}}></span>
                                            </span>
                                            sec
                                        </div>
                                    </div>
                                </div> : ""
                            }

                        </div>
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" onClick={()=>{setId('');fetchData()}}>✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Booking Detail</h3>
                    <hr className="border-gray-300 my-2" />
                    <div className="grid grid-cols-2 gap-2">
                        <h5 className="text-md text-inherit font-bold">ID Booking</h5>
                        <h5 className="text-md text-current font-semibold">{data.id_booking}</h5>
                        <h5 className="text-md text-inherit font-bold">Customer Name</h5>
                        <h5 className="text-md text-current font-semibold">{data.nama}</h5>
                        <h5 className="text-md text-inherit font-bold">Check In</h5>
                        <h5 className="text-md text-current font-semibold">{checkin}</h5>
                        <h5 className="text-md text-inherit font-bold">Check Out</h5>
                        <h5 className="text-md text-current font-semibold">{checkout}</h5>
                        <h5 className="text-md text-inherit font-bold">Guest</h5>
                        <h5 className="text-md text-current font-semibold">{data.jumlah_dewasa} Adults, {data.jumlah_anak} Children</h5>
                    </div>
                    {
                        data.id_deposit != null ?
                        <>
                            <h3 className="font-bold text-lg mt-5">Deposit Detail</h3>
                            <hr className="border-gray-300 my-2" />
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <h5 className="text-md text-inherit font-bold">Deposit</h5>
                                <h5 className="text-md text-current font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.jumlah_deposit)}</h5>
                            </div>
                            <div className="card bg-base-100 border">
                                <div className="card-body">
                                    <div className="grid grid-cols-2 gap-0 justify-between">
                                        <h5 className="text-xs text-current">Left</h5>
                                        <h5 className="text-xs text-inherit text-right">Spent</h5>
                                        <h5 className="text-md text-current font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format((data.jumlah_deposit-totalFasilitas))}</h5>
                                        <h5 className="text-md text-inherit font-semibold text-right">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalFasilitas)}</h5>
                                    </div>
                                    <input type="range" min={0} max="100" value={(data.jumlah_deposit-totalFasilitas) / data.jumlah_deposit * 100} className="range range-primary  range-xs" />
                                    {
                                        ((data.jumlah_deposit-totalFasilitas) / data.jumlah_deposit * 100) <= 0 ?
                                        <div className="flex justify-center gap-2 items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-primary shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            <span className="text-primary">The fasility spent is more than deposit. The customer will get additional charge at the end</span>
                                        </div> : ""
                                    }
                                </div>
                            </div>
                        </> : ""
                    }
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
                            {
                                totalKamar > 0 ?
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className="text-md font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalKamar)}</td>
                                </tr> : ""
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
                                                <td>{new Date(data.created_at).toDateString() + " " + new Date(data.created_at).toString().split(" ")[4]}</td>
                                                <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.sub_total_fasilitas)}</td>
                                            </tr>
                                        )
                                    }) : <tr><td colSpan="4">No Data</td></tr>
                                }
                                {
                                    totalFasilitas > 0 ?
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="text-md font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalFasilitas)}</td>
                                    </tr> : ""
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
                                <h5 className="text-md text-current font-semibold">{new Date(data.created_at).toDateString() + " " + new Date(data.created_at).toString().split(" ")[4]}</h5>
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
                        status === '2' && data.status_reservasi != 'Canceled' && now >= checkinDate?
                        <div className="mt-5">
                            <button className="btn btn-primary w-full" onClick={checkInHandle}>Check In</button>
                        </div>
                        : status === '2' && data.status_reservasi != 'Canceled' ?
                        <div className="mt-5">
                            <button className="btn btn-primary w-full" disabled>Not Check In Date</button>
                        </div>
                        : ""
                    }
                    {
                        status === '3' && data.status_reservasi != 'Canceled' ?
                        <div className="mt-5">
                            <button className="btn btn-primary w-full" onClick={fasilityHandle}>Add Facility</button>
                        </div>: ""
                    }
                    {
                        status === '4' && data.status_reservasi != 'Canceled' ?
                        <div className="mt-5">
                            <button className="btn btn-primary w-full" onClick={invoice}>Print Invoice</button>
                        </div>: ""
                    }
                    <div className="mt-5">
                        <BookingStep step={status} />
                    </div>
                    {
                        status === '3' && data.status_reservasi != 'Canceled' ?
                        <div className="mt-5">
                            <button className="btn btn-warning w-full" onClick={checkoutHandle}>Check Out</button>
                        </div>: ""
                    }
                </div>
            </dialog>
            <LoadingModal id="loading"/>
            
            <Success id="success_modal" title="Success" message={message} button="OK" onClick={()=>fetchData()} hideCloseButton={true}/>
            {
                status === '2' && data.status_reservasi != 'Canceled' && now >= checkinDate?
                <AddBookingKamarModal id={id} fetchData={fetchData} refreshData={refreshData}/>
                :""
            }
            {
                status === '3' && data.status_reservasi != 'Canceled' ?
                <AddBookingFasilitasModal id={id} refreshData={refreshData}/>
                :""
            }
            {
                status === '3' && data.status_reservasi != 'Canceled' ?
                <CheckoutDetailModal id={id} fetchData={fetchData} refreshData={refreshData} setId={setId} data={data} dataKamar={dataKamar} dataLayanan={dataLayanan} />
                :""
            }
        </>
    );
}

export default TransaksiDetailModal;