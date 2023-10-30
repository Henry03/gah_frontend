import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingModal from "../../LoadingModal";
import KamarDetailModal from "../kamar/kamarDetailModal";
import { Link } from "react-router-dom";
import AddKamarModal from "../kamar/addKamarModal";
import Pagination from "../../pagination";
import {AiOutlineSortAscending, AiOutlineSortDescending} from 'react-icons/ai'
import AddCustomerModal from "./addCustomerModal";
import CustomerDetailModal from "./customerDetailModal";



function Customer () {
    const [data, setData] = useState([])
    const [idCustomer, setId] = useState('')
    const [keyword, setKeyword] = useState('')
    const [firstPage, setFirstPage] = useState('1')
    const [lastPage, setLastPage] = useState('')
    const [prevPage, setPrevPage] = useState('')
    const [nextPage, setNextPage] = useState('')
    const [currentPage, setCurrentPage] = useState('1')
    const [filter, setFilter] = useState('nama')
    const [sort, setSort] = useState('asc')

    const getData = (e) => {
        e?.preventDefault()
        const data = {
            keyword: keyword,
            filter: filter,
            sort: sort
        }
        const loading = document.getElementById('loading_modal')
        loading.showModal()

        axios.post(`/customer/grup?page=`+currentPage, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => {
            setData(res.data.data.data)
            setLastPage(res.data.data.last_page)
            setNextPage(res.data.data.current_page+1)
            setPrevPage(res.data.data.current_page-1)
            loading.close()
        })
        .catch((err) => {
            loading.close()
        })
    }

    const setModal = (id) => {
        const modal = document.getElementById('customer_modal')
        setId(id)
        modal.showModal()
    }


    useEffect(() => {
        getData()
    }, [currentPage, filter, sort])

    return (
        <>
        
            <div className="flex items-center mt-5 mx-5">
                <div className="bg-base-100 card mt-5 shadow-2xl w-full flex justify-between flex-row items-center px-5 py-2">
                    <div className="rounded-xl p-4 text-3xl font-bold">
                        Customer Grup Data
                    </div>
                    <Link className="btn btn-primary" onClick={() => document.getElementById('add_customer_modal').showModal()}>Add Customer</Link>
                </div>
            </div>
            <div className="flex items-center mb-5 mx-5">
                <div className="bg-base-100 card my-5 shadow-2xl w-full">
                    <div className="rounded-xl ">
                        <div className="flex items-center">
                            <form className="flex-initial m-5" onSubmit={getData}>
                                <div className="form-control">
                                    <div className="input-group w-full">
                                        <input type="text" placeholder="Search…" className="input input-bordered" value={keyword} onChange={(e)=>setKeyword(e.target.value)} on/>
                                        <button className="btn btn-square" type="submit" >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <select className="select select-bordered max-w-xs" value={filter} onChange={(e)=>setFilter(e.target.value)}>
                                <option disabled selected>Filter</option>
                                <option value='nama'>Name</option>
                                <option value='nama_institusi'>Institute</option>
                                <option value='email'>Email</option>
                                <option value='no_telp'>Phone Number</option>
                            </select>
                            <label className="swap swap-indeterminate ms-2">
                                <input type="checkbox" />
                                <AiOutlineSortAscending className="swap-off" size='25' onClick={()=>setSort('asc')}/>
                                <AiOutlineSortDescending className="swap-on" size='25' onClick={()=>setSort('desc')}/>
                                
                            </label>

                        </div>
                        <div className="overflow-x-auto">
                            <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>
                                        Name
                                    </th>
                                    <th>Institute</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                data.map(data => {
                                    return (
                                        <tr key={data.id}>
                                        <td>
                                            <div className="flex items-center space-x-3">
                                                <div className="font-bold">{data.nama}</div>
                                            </div>
                                        </td>
                                        <td>
                                            {data.nama_institusi}
                                        </td>
                                        <td>
                                            {data.email}
                                        </td>
                                        <td>
                                            {data.no_telp}
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
                            
                            </table>
                            <Pagination firstPage={firstPage} prevPage={prevPage} nextPage={nextPage} lastPage={lastPage} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
                            
                        </div>
                    </div>
                </div>
            </div>
            <LoadingModal />
            <AddCustomerModal />
            <CustomerDetailModal id={idCustomer}/>
        </>
           
    )
}

export default Customer