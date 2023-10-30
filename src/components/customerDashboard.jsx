import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import TransactionDetailModal from "./customer/transaction/transactionDetailModal";

function CustomerDashboard() {
    const [riwayat, setRiwayat] = useState([])
    const [id, setId] = useState('1')

    const getData = () => {
        axios.get('/reservasi', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        })
        .then((res) => {
            setRiwayat(res.data.data)
        })
        .catch((err) => {
        })
    }

    const setModal = (id) => {
        const modal = document.getElementById('change_password_modal')
        setId(id)
        modal.showModal()
    }
    
    useEffect(() => {
        getData()
    }, [])

    return (
        <div className="h-screen bg-base-200">
            <NavBar />
            <div className=" flex items-center m-5">
            <div className="card mx-auto my-5 w-full lg:m-5 md:m-2 shadow-xl">
                <div className="bg-base-100 rounded-xl">
                <div className="overflow-x-auto">
                    <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                        <th>
                            Booking ID
                        </th>
                        <th>Booking Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        riwayat.map(data => {
                            return (
                                <tr key={data.id}>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="font-bold">{data.id_booking}</div>
                                        </div>
                                    </td>
                                    <td>
                                        {new Date(data.tgl_reservasi).toDateString() + " " + new Date(data.tgl_reservasi).toLocaleTimeString()}
                                    </td>
                                    <td>
                                        {new Date(data.check_in).toDateString()}
                                    </td>
                                    <td>
                                        {new Date(data.check_out).toDateString()}
                                    </td>
                                    {/* <td>
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.total_pembayaran)}
                                    </td> */}
                                    <td>
                                        <span className="badge badge-success">{data.status_reservasi}</span>
                                    </td>
                                    <th>
                                        <button className="btn btn-ghost btn-sm" onClick={()=>setModal(data.id)}>Detail</button>
                                    </th>
                                    
                                </tr>
                            );
                        })
                    }
                        
                    </tbody>
                    {/* foot */}
                    <tfoot>
                        <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Job</th>
                        <th>Favorite Color</th>
                        <th></th>
                        </tr>
                    </tfoot>
                    
                    </table>
                </div>
                </div>
            </div>
            </div>

        {/* <LoadingModal /> */}
        <TransactionDetailModal id={id}/>
        </div>
    );
}

export default CustomerDashboard;