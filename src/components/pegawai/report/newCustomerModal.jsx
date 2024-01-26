import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SuccessModal from "../../successModal";
import Error500 from "../../errorHandling/error500";
import LoadingModal from "../../LoadingModal";

function NewCustomerModal({year}) {
    const [customer, setCustomer] = useState([])
    const [total, setTotal] = useState(0)

    const getMostResrvation = () => {
        const loading = document.getElementById('loading_modal')
        loading.showModal()
        axios.post('/new-customer', {year:year}, {
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

            const response = await fetch('http://localhost:8000/api/new-customer-report/', {
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
        getMostResrvation()
    },[year])

    return (
        <>
            <dialog id="new_customer_modal" className="modal">
                <div className="modal-box no-scrollbar max-w-2xl">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className="items-center">
                            <h5 className="text-lg text-inherit text-center font-bold">New Customer Report</h5>
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
                                <th>Month</th>
                                <th>Quantity</th>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    customer ?
                                    customer.map((data, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{data.no}</td>
                                                <td>{data.bulan }</td>
                                                <td>{data.jumlah}</td>
                                            </tr>
                                        );
                                    })
                                    : ""
                                }
                                <tr>
                                    <td></td>
                                    <td className="font-bold">Total</td>
                                    <td className="font-bold">{total}</td>
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

export default NewCustomerModal;