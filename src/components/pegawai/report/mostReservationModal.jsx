import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SuccessModal from "../../successModal";
import Error500 from "../../errorHandling/error500";
import LoadingModal from "../../LoadingModal";

function MostReservationModal({year}) {
    const [customer, setCustomer] = useState([])
    const [total, setTotal] = useState(0)

    const getMostReservation = () => {
        console.log(year)
        const loading = document.getElementById('loading_modal')
        loading.showModal()
        axios.post('/most-reservation', {year:year}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => {
            console.log(res.data)
            setCustomer(res.data.customer)
            setTotal(res.data.total)
            loading.close()
        })
        .catch((err) => {
            console.log(err)
            loading.close() 
        })
    }

    const printReport = async() => {
        const printLoading = document.getElementById('loading_modal')
        printLoading.showModal()
        try{
            const formData = new FormData();

            formData.append('year', year);

            const response = await fetch('http://localhost:8000/api/most-reservation-report/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    Accept: 'application/pdf'
                },
                responseType: 'blob',
                body: formData
            })
            
            printLoading.close()
            // console.log(response.blob())
            const blob = await response.blob()
            console.log(response)
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'most-reservation-report.pdf'
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
        getMostReservation()
    },[year])

    return (
        <>
            <dialog id="most_reservation_modal" className="modal">
                <div className="modal-box no-scrollbar max-w-2xl">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className="items-center">
                            <h5 className="text-lg text-inherit text-center font-bold">5 Most Reservation Customer Report</h5>
                        </div>
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">✕</button>
                    </form>
                    <h4 className=" my-2">Year : {year} </h4>
                    <div className="overflow-x-auto card border">
                        <table className="table">
                            {/* head */}
                            <thead>
                            <tr>
                                <th>No.</th>
                                <th>Customer's Name</th>
                                <th>Reservation Count</th>
                                <th>Total Payment</th>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    customer ?
                                    customer.map((data, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{data.no}</td>
                                                <td>{data.nama }</td>
                                                <td>{data.jumlah}</td>
                                                <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.total)}</td>
                                            </tr>
                                        );
                                    })
                                    : ""
                                }
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td className="font-bold">Total</td>
                                    <td className="font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="grid grid-flow-col justify-end">
                        <button className="btn btn-primary mt-5" onClick={()=>printReport()}>Print Report</button>
                    </div>
                </div>
            </dialog>
            <LoadingModal />
        </>
    );
}

export default MostReservationModal;