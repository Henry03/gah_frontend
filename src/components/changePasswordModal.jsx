import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import LoadingModal from "./LoadingModal";
import SuccessModal from "./successModal";

function ChangePasswordModal() {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState([])
    const loading = document.getElementById('loading_modal')
    const success = document.getElementById('success_modal')

    const submitForm = (e) => {
        e.preventDefault()

        loading.showModal()

        const data = {
            old_password: oldPassword,
            password: newPassword,
            password_confirmation: confirmNewPassword
        }

        axios.post('/change-password', data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            loading.close()
            success.showModal()
            setOldPassword('')
            setNewPassword('')
            setConfirmNewPassword('')
        })
        .catch(error => {
            setErrorMessage(error.response.data.errors)
            loading.close()
        })
    }

    return (
        <>
            <dialog id="change_password_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Change Password</h3>
                    <form onSubmit={(e)=>submitForm(e)}>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Old Password</span>
                            </label>
                            <input type="password" placeholder="Enter your old password" className="input input-bordered w-full" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
                            {
                                errorMessage && errorMessage.old_password ? <label className="label">
                                <span className="label-text-alt text-red-600">{errorMessage.old_password}</span>
                                </label> : ""
                            }
                        </div>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">New Password</span>
                            </label>
                            <input type="password" placeholder="Enter your new password" className="input input-bordered w-full" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                            {
                                errorMessage && errorMessage.password ? <label className="label">
                                <span className="label-text-alt text-red-600">{errorMessage.password}</span>
                                </label> : ""
                            }
                        </div>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">New Password Confirmation</span>
                            </label>
                            <input type="password" placeholder="Re-enter your new password" className="input input-bordered w-full" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}/>
                            {
                                errorMessage && errorMessage.password_confirmation ? <label className="label">
                                <span className="label-text-alt text-red-600">{errorMessage.password_confirmation}</span>
                                </label> : ""
                            }
                        </div>
                        <div className="modal-action">
                            <div method="dialog" className="flex justify-center gap-7">
                                {/* if there is a button in form, it will close the modal */}
                                <Link className="btn btn-ghost hover:btn-error" onClick={()=>document.getElementById('change_password_modal').close()}>Cancel</Link>
                                <button type="submit" className="btn btn-primary" >Change Password</button>
                            </div>
                        </div>

                    </form>
                </div>
            </dialog>
            <SuccessModal message="Succesfully Change Password" title="" button="Oke" link="/profile" onClick={()=>document.getElementById('change_password_modal').close()}/>
        </>
    );
}

export default ChangePasswordModal;