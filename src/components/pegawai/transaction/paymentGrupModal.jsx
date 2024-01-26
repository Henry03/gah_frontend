import axios from "axios";
import { useState, useEffect } from "react";
import Success from "../../errorHandling/success";
import { useNavigate } from "react-router-dom";

function PaymentGrupModal ({id, total}) {
    const navigate = useNavigate()
    const [image, setImage] = useState(null)
    const [message, setMessage] = useState([])

    const handleFileChange = (e) => {
        console.log(e.target.files[0])
        setImage(e.target.files[0])
      };
      
    const payment = () => {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('jumlah_uang_jaminan', total);
        formData.append('id_reservasi', id)

        console.log(formData.image)

        const modal = document.getElementById('payment_modal');
        const loading = document.getElementById('loading_modal');
        const success = document.getElementById('success_modal');
        loading.showModal();

        axios.post('/uang-jaminan', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => {
            loading.close();
            console.log(res.data)
            modal.close();
            success.showModal();
        })
        .catch((err) => {
            loading.close()
            setMessage(err.response.data.errors)
            console.log(err.response)
        })
    }

    const refresh = () => {
        document.getElementById('success_modal').close()
        window.location.reload()
    }
    
    return(
        <>
            <dialog id="payment_modal" className="modal">
                <div className="modal-box no-scrollbar">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className=" flex flex-col items-center justify-center">
                            <h5 className="text-lg text-inherit text-center font-bold">Payment</h5>
                            {/* {
                                data.status_reservasi === 'Waiting for Payment' ? <span className="badge badge-warning m-2">{data.status_reservasi}</span>
                                : <span className="badge badge-success m-2">{data.status_reservasi}</span>
                            } */}

                        </div>
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">✕</button>
                    </form>
                    <hr className="border-gray-300 my-2" />
                    <div className="card border-2 mx-auto my-5 w-full p-3">
                        <h5 className="text-md text-current font-semibold">Transfer Bank</h5>
                        <hr className="border-gray-100 my-2" />
                        <div className="flex flex-row justify-between">
                            <div className="grid grid-flow-row">
                                <h5 className="text-md text-current">Account number</h5>
                                <h5 className="text-lg text-current font-bold">770011770022</h5>
                            </div>
                            <div className="grid grid-flow-row text-right">
                                <h5 className="text-md text-current">Bank name</h5>
                                <h5 className="text-lg text-current font-bold">BANK DIAMOND</h5>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center mt-5">
                            <h5 className="text-md text-current">Payment Total</h5>
                            <h5 className="text-lg text-current font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)}</h5>
                        </div>
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Upload your struk</span>
                        </label>
                        <input type="file" className="file-input file-input-bordered w-full" accept="image/*" onChange={handleFileChange}/>
                        {
                            message && message.image ?
                            <label className="label">
                                <span className="label-text-alt text-red-500">{message.image}</span>
                            </label> : ""
                        }
                    </div>
                    <div className="flex my-5 justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-primary shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span className="text-primary">Make sure the file you upload is valid</span>
                    </div>
                    <button className="btn btn-primary w-full" onClick={payment}>Pay Now</button>
                    
                </div>
            </dialog>
            <Success id="success_modal" title="Success" message="Your payment has been confirmed" button="OK" onClick={()=>refresh()} hideCloseButton={true}/>
        </>
    )
}

export default PaymentGrupModal;