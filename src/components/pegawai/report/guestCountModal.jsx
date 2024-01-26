import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SuccessModal from "../../successModal";
import Error500 from "../../errorHandling/error500";
import LoadingModal from "../../LoadingModal";

function GuestCountModal({year,month, total, guest}) {
    const date = new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const printReport = async() => {
        const printLoading = document.getElementById('loading_modal')
        printLoading.showModal()
        try{
            const formData = new FormData();

            formData.append('year', year);
            formData.append('month', month);

            const response = await fetch('http://localhost:8000/api/guest-count-report/', {
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
            link.download = 'guest-count.pdf'
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(url)
        }
        catch(error){
            printLoading.close()
            console.log(error)
        }

    }

    return (
        <>
            <dialog id="guest_count_modal" className="modal">
                <div className="modal-box no-scrollbar max-w-2xl">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className="items-center">
                            <h5 className="text-lg text-inherit text-center font-bold">Guest Count Report</h5>
                        </div>
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">✕</button>
                    </form>
                    <h4 className=" my-2">Date : {date}</h4>
                    <div className="overflow-x-auto card border">
                        <table className="table">
                            {/* head */}
                            <thead>
                            <tr>
                                <th>No.</th>
                                <th>Room Type</th>
                                <th>Personal</th>
                                <th>Grup</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    guest ?
                                    guest.map((data, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{data.no}</td>
                                                <td>{data.jenis_kamar}</td>
                                                <td>{data.personal}</td>
                                                <td>{data.grup}</td>
                                                <td>{data.total}</td>
                                            </tr>
                                        );
                                    })
                                    : ""
                                }
                                <tr>
                                    <td></td>
                                    <td></td>
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

export default GuestCountModal;