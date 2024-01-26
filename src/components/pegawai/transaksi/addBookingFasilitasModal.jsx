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

function AddBookingFasilitasModal({id, refreshData}) {
    const [data, setData] = useState({})
    const [dataLayanan, setDataLayanan] = useState([])
    const [bookingDate, setBooking] = useState('')
    const [checkin, setCheckin] = useState('')
    const [checkout, setCheckout] = useState('')
    const [message, setMessage] = useState('')
    const [selectedFasilitas, setSelectedFasilitas] = useState([]);

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

            loading.close()
        })
        .catch(error => {
            loading.close()
        })
    }

    const getFasilitas = () => {

        // loading.showModal()

        axios.get('/fasilitas', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setDataLayanan(response.data.data)

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

    const store = () => {
        const loading = document.getElementById('loading_modal')
        const successModal = document.getElementById('success_add_fasilitas_modal')
        const TransactionDetailModal = document.getElementById('transaction_detail_modal')
        loading.showModal()

        const data = {
            id_reservasi: id,
            fasilitas: selectedFasilitas
        }

        axios.post('/reservasi-fasilitas/store', data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            console.log(response)
            loading.close()
            setMessage("Add Facility Success")
            successModal.showModal()
            TransactionDetailModal.close()
        })
        .catch(error => {
            loading.close()
            console.log(error)
        })
    }

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity >= 0) {
            const updatedSelectedFasilitas = [...selectedFasilitas];
            const selectedItemIndex = updatedSelectedFasilitas.findIndex((item) => item.id === itemId);
    
            if (newQuantity === 0) {
                // If the new quantity is 0, remove the item from the array
                if (selectedItemIndex !== -1) {
                    updatedSelectedFasilitas.splice(selectedItemIndex, 1);
                }
            } else {
                // Update the quantity if it's greater than 0
                if (selectedItemIndex === -1) {
                    // If the item is not in the selectedFasilitas array, add it with the quantity
                    updatedSelectedFasilitas.push({
                        id: itemId,
                        quantity: newQuantity,
                        nama_fasilitas: dataLayanan.find((item) => item.id === itemId).nama_fasilitas,
                        harga: dataLayanan.find((item) => item.id === itemId).harga
                    });
                } else {
                    // If the item is already in the array, update the quantity
                    updatedSelectedFasilitas[selectedItemIndex].quantity = newQuantity;
                }
            }
    
            setSelectedFasilitas(updatedSelectedFasilitas);
        }
    };

    const getQuantityForItem = (itemId) => {
        const selectedItem = selectedFasilitas.find((item) => item.id === itemId);
        return selectedItem ? selectedItem.quantity : 0;
    };

    const fetchDataParent = () => {
        const success = document.getElementById('success_add_fasilitas_modal')
        const addBookingKamarModal = document.getElementById('add_booking_fasilitas_modal')
        const transaksiDetailModal = document.getElementById('transaction_detail_modal')
        
        refreshData();
        setSelectedFasilitas([]);

        success.close()
        addBookingKamarModal.close()
        transaksiDetailModal.showModal()
    }
    
    useEffect(() => {
        if(id){
            getData()
            getFasilitas()
            getJumlahKamar()
        }
    },[id])

    return (
        <>
            <dialog id="add_booking_fasilitas_modal" className="modal">
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
                    
                    <h3 className="font-bold text-lg mt-5">Add Facility</h3>
                    <hr className="border-gray-300 my-2" />
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                            <tr>
                                <th>Facility</th>
                                <th>Price</th>
                                <th>Quantity</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                dataLayanan ? dataLayanan.map((data, index) => {
                                    return(
                                        <tr key={index}>
                                            <td>{data.nama_fasilitas}</td>
                                            <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.harga)}</td>
                                            <div className="join">
                                                <button className="btn bg-transparent join-item" onClick={() => updateQuantity(data.id, getQuantityForItem(data.id) - 1)}>-</button>
                                                <input
                                                    readOnly
                                                    type="text"
                                                    placeholder="0"
                                                    min="0"
                                                    style={{ borderRadius: "0" }}
                                                    className="input input-bordered w-14 p-2 text-center"
                                                    value={getQuantityForItem(data.id)}
                                                />
                                                <button className="btn bg-transparent join-item" onClick={() => updateQuantity(data.id, getQuantityForItem(data.id) + 1)}>+</button>
                                            </div>
                                            
                                        </tr>
                                    )
                                }) : <tr><td colSpan="4">No Data</td></tr>
                            }
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-5">
                        <button className="btn btn-primary w-full" onClick={store}>Confirm</button>
                    </div>
                </div>
            </dialog>
            
            <Success id="success_add_fasilitas_modal" title="Success" message={message} button="OK" onClick={()=>fetchDataParent()} hideCloseButton={true}/>
        </>
    );
}

export default AddBookingFasilitasModal;