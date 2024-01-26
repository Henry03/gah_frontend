import axios from "axios";
import { useEffect, useState } from "react";
import { Button, DatePicker } from "antd";
import { Column } from "@ant-design/plots";
import dayjs from "dayjs";
import { set } from "lodash";
import LoadingModal from "../../LoadingModal";
import GuestCountModal from "./guestCountModal";
import MostReservationModal from "./mostReservationModal";
import NewCustomerModal from "./newCustomerModal";
import MonthlyIncomeModal from "./monthlyIncomeModal";

function ReportHome() {
    const [incomeYear, setIncomeYear] = useState('')
    const [guestYear, setGuestYear] = useState('')
    const [guestMonth, setGuestMonth] = useState('')
    const [newCustomerYear, setNewCustomerYear] = useState('')
    const [mostReservationYear, setMostReservationYear] = useState('')
    const [income, setIncome] = useState([])
    const [incomeDetail, setIncomeDetail] = useState([{}])
    const [guest, setGuest] = useState([])
    const [guestDetail, setGuestDetail] = useState([{}])
    const [totalIncome, setTotalIncome] = useState(0)
    const [total, setTotal] = useState(0)
    const loading = document.getElementById('loading_modal')
    const onChangeIncome = (date, dateString) => {
        setIncomeYear(dateString)
    };
    const onChangeCount = (date, dateString) => {
        const [year, month] = dateString.split('-');
        setGuestYear(year)
        setGuestMonth(month)
    };
    const onChangeNewCustomer = (date, dateString) => {
        setNewCustomerYear(dateString)
    };
    const onChangeMostReservation = (date, dateString) => {
        setMostReservationYear(dateString)
    };

    const getMonthIncome = () => {
        document.getElementById('loading_modal').showModal()
        axios.post('/monthly-income', {year:incomeYear}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => {
            console.log(res.data)
            setIncome(res.data.data)
            setIncomeDetail(res.data.income)
            setTotalIncome(res.data.total)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const getGuestCount = () => {
        document.getElementById('loading_modal').showModal()
        axios.post('/guest-count', {year:guestYear,month:guestMonth}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => {
            console.log(res.data)
            setGuest(res.data.data)
            setGuestDetail(res.data.guest)
            setTotal(res.data.total)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const monthlyIncomeModalHandler = () => {
        const modal = document.getElementById('monthly_income_modal')
        modal.showModal()
    }

    const guestCountModalHandler = () => {
        const modal = document.getElementById('guest_count_modal')
        modal.showModal()
    }

    const mostReservationModalHandler = () => {
        const modal = document.getElementById('most_reservation_modal')
        modal.showModal()
    }

    const newCustomerModalHandler = () => {
        const modal = document.getElementById('new_customer_modal')
        modal.showModal()
    }

    useEffect(() => {
        if(income && guest){
            document.getElementById('loading_modal').close()

        }
    },[income, guest])

    useEffect(() => {
        getMonthIncome()
    },[incomeYear])

    useEffect(() => {
        getGuestCount()
    },[guestYear, guestMonth])

    useEffect(() => {
        const today = new Date(); 
        setIncomeYear(today.getFullYear().toString())
        setGuestYear(today.getFullYear().toString())
        setGuestMonth((today.getMonth()+1).toString())
        setNewCustomerYear(today.getFullYear().toString())
        setMostReservationYear(today.getFullYear().toString())
        getMonthIncome()
        getGuestCount()
    },[]) 
    
    const configIncome = {
        data: income,
        xField: 'bulan',
        yField: 'value',
        seriesField: 'type',
        isGroup: true,
        columnStyle: {
            radius: [20, 20, 0, 0],
        },
    };

    const configGuest = {
        data: guest,
        xField: 'Jenis Kamar',
        yField: 'value',
        seriesField: 'type',
        isGroup: true,
        columnStyle: {
            radius: [20, 20, 0, 0],
        },
    };
    return (
        <>
        
        <div className="card bg-base-100 m-3 p-3 grid grid-flow-row gap-3">
            <div className="w-full grid md:grid-cols-2 gap-3 ">
                <div className="card bg-neutral-100 dark:bg-neutral p-5 flex">
                    <div className="mb-3 grid grid-flow-col grid-cols-4 gap-2 ">
                        <p className="text-xl font-semibold mb-2 col-span-2">Monthly Income</p>
                        {
                            incomeYear ?
                            <>
                                <DatePicker defaultValue={dayjs(incomeYear, 'YYYY')} className="btn btn-sm btn-outline w-full dark:text-white" onChange={onChangeIncome} picker="year" />
                                <button className="btn btn-sm btn-primary" onClick={monthlyIncomeModalHandler}>Detail</button>
                            </>
                            : ''
                        }

                    </div>
                    <Column {...configIncome} />
                </div>
                <div className="card bg-neutral-100 dark:bg-neutral p-5">
                    <div className="mb-3 grid grid-flow-col grid-cols-4 gap-2 ">
                        <p className="text-xl font-semibold mb-2 col-span-2">Guest Count</p>
                        {
                            guestYear && guestMonth ?
                            <>
                                <DatePicker defaultValue={dayjs(guestYear+ '-' + guestMonth, 'YYYY-M')} className="btn btn-sm btn-outline" onChange={onChangeCount} picker="month" />
                                <button className="btn btn-sm btn-primary" onClick={guestCountModalHandler}>Detail</button>
                            </>
                            
                            : ''
                        }
                    </div>
                    <Column {...configGuest} />
                </div>

            </div>
            <div className="card bg-neutral-100 dark:bg-neutral p-5 flex">
                <div className="grid grid-flow-col grid-cols-4 gap-2 ">
                    <p className="text-xl font-semibold mb-2 col-span-2">New Customer</p>
                    {
                        incomeYear ?
                        <>
                            <DatePicker defaultValue={dayjs(newCustomerYear, 'YYYY')} className="btn btn-sm btn-outline w-full dark:text-white" onChange={onChangeNewCustomer} picker="year" />
                            <button className="btn btn-sm btn-primary" onClick={newCustomerModalHandler}>Detail</button>
                        </>
                        : ''
                    }
                </div>
            </div>
            <div className="card bg-neutral-100 dark:bg-neutral p-5 flex">
                <div className="grid grid-flow-col grid-cols-4 gap-2 ">
                    <p className="text-xl font-semibold mb-2 col-span-2">5 Most Reservations Customer</p>
                    {
                        incomeYear ?
                        <>
                            <DatePicker defaultValue={dayjs(mostReservationYear, 'YYYY')} className="btn btn-sm btn-outline w-full dark:text-white" onChange={onChangeMostReservation} picker="year" />
                            <button className="btn btn-sm btn-primary" onClick={mostReservationModalHandler}>Detail</button>
                        </>
                        : ''
                    }
                </div>
            </div>
            

        </div>

        <MonthlyIncomeModal year={incomeYear} total={totalIncome} income={incomeDetail}/>
        <GuestCountModal year={guestYear} month={guestMonth} total={total} guest={guestDetail}/>
        <MostReservationModal year={mostReservationYear}/>
        <NewCustomerModal year={newCustomerYear}/>
        <LoadingModal id="loading_modal" />
        </>
    );
}

export default ReportHome;