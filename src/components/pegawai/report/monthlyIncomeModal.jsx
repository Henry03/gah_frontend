import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SuccessModal from "../../successModal";
import Error500 from "../../errorHandling/error500";
import LoadingModal from "../../LoadingModal";

function MonthlyIncomeModal({year, total, income}) {

    const printReport = async() => {
        const printLoading = document.getElementById('loading_modal')
        printLoading.showModal()
        try{
            const formData = new FormData();

            formData.append('year', year);

            const response = await fetch('http://localhost:8000/api/monthly-income-report/', {
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
            link.download = 'monthly-income-report.pdf'
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
            <dialog id="monthly_income_modal" className="modal">
                <div className="modal-box no-scrollbar max-w-2xl">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className="items-center">
                            <h5 className="text-lg text-inherit text-center font-bold">Monthly Income Report</h5>
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
                                <th>Personal</th>
                                <th>Grup</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    income ?
                                    income.map((data, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index+1}</td>
                                                <td>{data.bulan}</td>
                                                <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.total_personal)}</td>
                                                <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.total_grup)}</td>
                                                <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.total)}</td>
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

export default MonthlyIncomeModal;