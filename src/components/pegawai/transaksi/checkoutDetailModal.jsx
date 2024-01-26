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

function CheckoutDetailModal({id, setId, fetchData, refreshData, data, dataKamar, dataLayanan}) {
    const [totalKamar, setTotalKamar] = useState(0)
    const [totalFasilitas, setTotalFasilitas] = useState(0)
    const [message, setMessage] = useState('')
    const now = new Date()
    const [checkinDate, setCheckinDate] = useState('')
    const [checkoutDate, setCheckoutDate] = useState('')
    const loading = document.getElementById('loading_modal')
    const [total, setTotal] = useState(0)
    const [subTotal, setSubTotal] = useState(0)
    const [tax, setTax] = useState(0)
    const [cash, setCash] = useState(0)


    const getTotalKamar = () => {
        let total = 0
        dataKamar.map((data) => {
            console.log(data.total_harga, data.jumlah)
            total += data.total_harga * data.jumlah
        })
        setTotalKamar(total)
    }

    const getTotalLayanan = () => {
        let total = 0
        dataLayanan.map((data) => {
            total += data.sub_total_fasilitas
        })
        setTotalFasilitas(total)
    }

    const invoice = async() => {
        const printLoading = document.getElementById('print_loading')
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

    const checkoutHandle = () => {
        fetchData()
        invoice()
        const checkoutModal = document.getElementById('checkout_detail_modal')
        const successModal = document.getElementById('success_checkout_modal')
        const confirmationModal = document.getElementById('checkout_confirmation')
        confirmationModal.close()
        successModal.close()
        checkoutModal.close()
    }


    const checkout = () => {
        const loading = document.getElementById('loading_modal')
        const success = document.getElementById('success_checkout_modal')
        const errorModal = document.getElementById('error_modal')

        const data = {
            id_reservasi: id,
            sub_total: subTotal,
            diskon: 0,
            pajak: tax,
            total_pembayaran: total,
            jumlah_pembayaran: cash,
        }

        loading.showModal()
        axios.post('/reservasi/checkout', data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => {
            console.log(res.data)
            setMessage("Successfully Check Out")
            loading.close()
            success.showModal()
        })
        .catch((err) => {
            console.log(err)
            setMessage("Failed Check Out")
            loading.close()
            errorModal.showModal()
        })
    }


    const taxTransaction = () => {
        let tax = 0
        tax = (totalFasilitas) * 10/100
        setTax(tax)
        return tax
    }

    const subTotalTransaction = () => {
        let subTotal = 0
        subTotal = totalKamar + totalFasilitas
        console.log(totalKamar, totalFasilitas)
        setSubTotal(subTotal)
        return subTotal
    }

    const totalTransaction = () => {
        let total = 0
        total = subTotal + tax
        console.log(subTotal, tax)
        setTotal(total)
        return total
    }

    const cashTransaction = () => {
        let cash = 0
        cash = total - data.jumlah_uang_jaminan - data.jumlah_deposit
        console.log(cash, total, data.jumlah_uang_jaminan, data.jumlah_deposit)
        setCash(cash)
        return cash
    }

    const close = () => {
        setTotal(0)
        setSubTotal(0)
        setTax(0)
        setCash(0)
        setId('')
        fetchData()
    }
    
    
    useEffect(()=> {
        if(dataKamar){
            getTotalKamar()
        }
        if(dataLayanan){
            getTotalLayanan()
        }
    },[dataKamar, dataLayanan])

    useEffect(() => {
        if(dataKamar && dataLayanan && dataKamar && totalKamar && totalFasilitas){
            subTotalTransaction()
            taxTransaction()
        }
    },[data, dataKamar, dataLayanan, totalKamar, totalFasilitas])

    useEffect(() => {
        if(tax && subTotal){
            totalTransaction()
        }
    },[tax, subTotal])
    
    useEffect(() => {
        if(total && data){
            cashTransaction()
        }
    },[total, data])

    return (
        <>
            <dialog id="checkout_detail_modal" className="modal">
                <div className="modal-box no-scrollbar justi">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className=" flex flex-col items-center justify-center">
                            <h5 className="text-lg text-inherit text-center font-bold">Booking Date</h5>
                            <h5 className="text-md text-current font-semibold">{new Date(data.created_at).toDateString() + " " + new Date(data.created_at).toLocaleTimeString()}</h5>
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
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3" onClick={()=>close()}>✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Booking Detail</h3>
                    <hr className="border-gray-300 my-2" />
                    <div className="grid grid-cols-2 gap-2">
                        <h5 className="text-md text-inherit font-bold">ID Booking</h5>
                        <h5 className="text-md text-current font-semibold">{data.id_booking}</h5>
                        <h5 className="text-md text-inherit font-bold">Customer Name</h5>
                        <h5 className="text-md text-current font-semibold">{data.nama}</h5>
                        <h5 className="text-md text-inherit font-bold">Customer Address</h5>
                        <h5 className="text-md text-current font-semibold">{data.alamat}</h5>
                        <h5 className="text-md text-inherit font-bold">Check In</h5>
                        <h5 className="text-md text-current font-semibold">{new Date(data.check_in).toDateString() + " " + new Date(data.check_in).toLocaleTimeString() }</h5>
                        <h5 className="text-md text-inherit font-bold">Check Out</h5>
                        <h5 className="text-md text-current font-semibold">{new Date(data.check_out).toDateString() + " " + new Date(data.check_out).toLocaleTimeString()}</h5>
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
                            dataLayanan.length == 0 ? <h5 className="text-sm text-current font-semibold text-center">No Data</h5> : 
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

                    <div className="grid grid-cols-2 mt-5">
                        <h3 className="font-bold text-lg">Transaction</h3>
                        <h3 className="font-bold text-lg text-right">{}</h3>
                    </div>
                    <hr className="border-gray-300 my-2" />
                    <div className="card border p-3">
                        <div className="grid grid-cols-2 gap-2">
                            <h5 className="text-md text-inherit font-bold">Sub Total</h5>
                            <h5 className="text-md text-current font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(subTotal)}</h5>
                            <h5 className="text-md text-inherit font-bold">{"Facility Tax (10%)"}</h5>
                            <h5 className="text-md text-current font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(tax)}</h5>
                            <h5 className="text-md text-inherit font-bold">Total</h5>
                            <h5 className="text-md text-current font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total) }</h5>
                            <hr className="border-gray-300 my-2 col-span-2" />
                            <h5 className="text-md text-inherit font-bold">Jaminan</h5>
                            <h5 className="text-md text-current font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.jumlah_uang_jaminan) }</h5>
                            <h5 className="text-md text-inherit font-bold">Deposit</h5>
                            <h5 className="text-md text-current font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.jumlah_deposit) }</h5>
                            <h5 className="text-md text-inherit font-bold">Cash</h5>
                            <h5 className="text-md text-current font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(cash) }</h5>
                        </div>

                    </div>
                    {
                        data.id_deposit != null && data.status_reservasi != 'Canceled' ?
                        <div className="mt-5">
                            <button className="btn btn-warning w-full" onClick={()=>document.getElementById("checkout_confirmation").showModal()}>Check Out</button>
                        </div>: ""
                    }
                </div>
            </dialog>
            <LoadingModal id="print_loading"/>
            
            <Success id="success_checkout_modal" title="Success" message={message} button="Print Invoice" onClick={()=>checkoutHandle()} hideCloseButton={true}/>
            <TwoButton id="checkout_confirmation" title="Check Out" message="Are you sure to check out this reservation?" button1="Cancel" onClick1={checkoutHandle} button2="Oke" onClick2={checkout}/>
            <AddBookingKamarModal id={id} refreshData={refreshData}/>
            <AddBookingFasilitasModal id={id} refreshData={refreshData}/>
        </>
    );
}

export default CheckoutDetailModal;