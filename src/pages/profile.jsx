import NavBar from "../components/NavBar";
import { useState } from "react";

function Profile() {
    const [noIdentitas, setNoIdentitas] = useState("")
    const [jenisIdentitas, setJenisIdentitas] = useState("")
    const [nama, setNama] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [noTelp, setNoTelp] = useState("")
    const [alamat, setAlamat] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState([])

    return(
        <>
            <NavBar/>
            <div className="bg-base-200 flex items-center">
                <div className="card mx-auto w-full max-w-5xl shadow-xl">
                    <div className="bg-base-100 rounded-xl">

                    </div>
                </div>
            </div>
            <div className="bg-base-200 flex items-center">
                <div className="card mx-auto w-full max-w-5xl shadow-xl">
                    <div className="bg-base-100 rounded-xl">
                        <div className="p-10">
                            <form>
                                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">ID Number</span>
                                        </label>
                                        <input type="text" placeholder="1403xxxxxx" className="input input-bordered w-full" value={noIdentitas} onChange={(e)=> setNoIdentitas(e.target.value)}/>
                                        {
                                            errorMessage && errorMessage.no_identitas ? <label className="label">
                                            <span className="label-text-alt text-red-600">{errorMessage.no_identitas}</span>
                                            </label> : ""
                                        }
                                    </div>

                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Name</span>
                                        </label>
                                        <input type="text" placeholder="Enter your name" className="input input-bordered w-full" value={nama} onChange={(e)=> setNama(e.target.value)}/>
                                        {
                                            errorMessage && errorMessage.nama ? <label className="label">
                                            <span className="label-text-alt text-red-600">{errorMessage.nama}</span>
                                            </label> : ""
                                        }
                                    </div>
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input type="email" placeholder="example@gah.com" className="input input-bordered w-full" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                                        {
                                            errorMessage && errorMessage.email ? <label className="label">
                                            <span className="label-text-alt text-red-600">{errorMessage.email}</span>
                                            </label> : ""
                                        }
                                    </div>

                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Phone Number</span>
                                        </label>
                                        <input type="text" placeholder="Enter your phone number" className="input input-bordered w-full" value={noTelp} onChange={(e) => setNoTelp(e.target.value)}/>
                                        {
                                            errorMessage && errorMessage.no_telp ? <label className="label">
                                            <span className="label-text-alt text-red-600">{errorMessage.no_telp}</span>
                                            </label> : ""
                                        }
                                    </div>

                                


                                </div>
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text">Address</span>
                                    </label>
                                    <textarea placeholder="Enter your address" className="textarea textarea-bordered w-full" value={alamat} onChange={(e) => setAlamat(e.target.value)}/>
                                    {
                                        errorMessage && errorMessage.alamat ? <label className="label">
                                        <span className="label-text-alt text-red-600">{errorMessage.alamat}</span>
                                        </label> : ""
                                    }
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;