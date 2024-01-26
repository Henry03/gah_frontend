import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Datepicker from "react-tailwindcss-datepicker";
import Superior from '../../assets/superior.jpg'
import DoubleDeluxe from '../../assets/double_deluxe.jpg'
import ExclusiveDeluxe from '../../assets/exclusive_deluxe.jpg'
import JuniorSuite from '../../assets/junior_suite.jpg'
import axios from "axios";
import LoadingModal from "../LoadingModal";
import Error from "../errorHandling/error";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Booking () {
    const navigate = useNavigate();
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');
    
    const [dewasa, setDewasa] = useState('1')
    const [anak, setAnak] = useState('0')
    const [kamar, setKamar] = useState('1')
    const [total, setTotal] = useState('0')
    const [totalFasilitas, setTotalFasilitas] = useState('0')
    const [availableRooms, setAvailableRooms] = useState([])
    const [roomRates, setRoomRates] = useState([])
    const [roomData, setRoomData] = useState({
        'Superior': { count: 0, rateId: null },
        'Double Deluxe': { count: 0, rateId: null },
        'Exclusive Deluxe': { count: 0, rateId: null },
        'Junior Suite': { count: 0, rateId: null },
      });

    const [selectedFasilitas, setSelectedFasilitas] = useState([]);
    const [fasilitas, setFasilitas] = useState([])

    const [isLoading, setIsLoading] = useState(false)

    const [step, setStep] = useState(1)

    const [value, setValue] = useState({ 
        startDate: null,
        endDate: null 
        }); 
        
    const handleValueChange = (newValue) => {
        console.log("newValue:", newValue); 
        console.log(year + '-' + month + '-' + day)
        setValue(newValue); 
        } 

    const roomTypes = ['superior', 'Double Deluxe', 'Exclusive Deluxe', 'Junior Suite'];

    const roomTypeImages = {
        "Superior": Superior,
        "Double Deluxe": DoubleDeluxe,
        "Exclusive Deluxe": ExclusiveDeluxe,
        "Junior Suite": JuniorSuite
    }

    const searchRoom = (e) => {
        e.preventDefault()

        const data = {
            check_in: value.startDate,
            check_out: value.endDate,
        }
        const loading = document.getElementById('loading_modal')
        const errorModal = document.getElementById('error_input_date')
        loading.showModal()

        axios.post('/available-rooms', data)
        .then((res) => {
            setAvailableRooms(res.data.rooms)
            setRoomRates(res.data.rates)
            setStep(2)
            loading.close()
            console.log(res.data)
        })
        .catch((err) => {
            if(err.response && err.response.status == 422){
                errorModal.showModal()
            }
            loading.close()
        })
    }

    const handleChange = (e, roomType, rateId) => {
        // Update the roomData state based on the roomType
        setRoomData({
          ...roomData,
          [roomType]: {
            count: e.target.value,
            rateId: rateId,
          },
        });
    };
    
    const increment = (e, roomType, roomLeft, rateId) => {
        const currentCount = roomData[roomType].count;
    
        if (currentCount < roomLeft) {
          // Update the roomData state based on the roomType
          setRoomData({
            ...roomData,
            [roomType]: {
              count: roomData[roomType].count + 1,
              rateId: rateId,
            },
          });
        }
    };
    
    const decrement = (e, roomType) => {
        // Update the roomData state based on the roomType
        if (roomData[roomType].count > 0) {
          setRoomData({
            ...roomData,
            [roomType]: {
              count: roomData[roomType].count - 1,
              rateId: roomData[roomType].rateId,
            },
          });
        }
    };

    const updateTotal = () => {
        let newTotal = 0;
        
        availableRooms.forEach((room, index) => {
            if (roomData[room.nama_jenis_kamar].count > 0) {
            newTotal += roomRates[index].harga * roomData[room.nama_jenis_kamar].count;
            }
        });
        
        setTotal(newTotal);
    };

    const updateTotalFasilitas = () => {
        let newTotal = 0;
        
        selectedFasilitas.forEach((item) => {
            newTotal+= item.harga * item.quantity;
        });
        
        setTotalFasilitas(newTotal);
    };

    const confirm = () => {
        const data = {
            check_in: value.startDate,
            check_out: value.endDate,
            jumlah_dewasa: dewasa,
            jumlah_anak: anak,
            superior: roomData["Superior"].count,
            double_deluxe: roomData["Double Deluxe"].count,
            exclusive_deluxe: roomData["Exclusive Deluxe"].count,
            junior_suite: roomData["Junior Suite"].count,
            superior_rate_id: roomData["Superior"].rateId,
            double_deluxe_rate_id: roomData["Double Deluxe"].rateId,
            exclusive_deluxe_rate_id: roomData["Exclusive Deluxe"].rateId,
            junior_suite_rate_id: roomData["Junior Suite"].rateId,
            fasilitas: selectedFasilitas
        }
        console.log(data)
        const loading = document.getElementById('loading_modal')
        const success = document.getElementById('success')
        loading.showModal()

        axios.post('/reservasi/personal', data,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }
        )
        .then((res) => {
            loading.close()
            success.showModal()
            console.log(res.data)
        })
        .catch((err) => {
            loading.close()
        })
    
    }

    const getFasilitas = () => {
        axios.get('/fasilitas', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => {
            setFasilitas(res.data.data)
            console.log(res.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }
    
    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity >= 0) {
            const updatedSelectedFasilitas = [...selectedFasilitas];
            const selectedItemIndex = updatedSelectedFasilitas.findIndex((item) => item.id === itemId);
    
            if (newQuantity === 0) {
                // If the new quantity is 0, remove the item from the array
                if (selectedItemIndex !== -1) {
                    updatedSelectedFasilitas.splice(selectedItemIndex, 1);
                }
            } else {
                // Update the quantity if it's greater than 0
                if (selectedItemIndex === -1) {
                    // If the item is not in the selectedFasilitas array, add it with the quantity
                    updatedSelectedFasilitas.push({
                        id: itemId,
                        quantity: newQuantity,
                        nama_fasilitas: fasilitas.find((item) => item.id === itemId).nama_fasilitas,
                        harga: fasilitas.find((item) => item.id === itemId).harga
                    });
                } else {
                    // If the item is already in the array, update the quantity
                    updatedSelectedFasilitas[selectedItemIndex].quantity = newQuantity;
                }
            }
    
            setSelectedFasilitas(updatedSelectedFasilitas);
        }
    };

    const getQuantityForItem = (itemId) => {
        const selectedItem = selectedFasilitas.find((item) => item.id === itemId);
        return selectedItem ? selectedItem.quantity : 0;
    };

    useEffect(() => {
        getFasilitas()
    }, [])

    useEffect(() => {
        updateTotal();
    }, [roomData]);

    useEffect(() => {
        updateTotalFasilitas();
    }, [selectedFasilitas]);

    return(
        <>
            <div className="m-5">
                <div className="flex items-center mt-5 mx-5">
                    <div className="bg-base-100 card mt-5 shadow-2xl w-full flex justify-between flex-col px-5 py-2">
                        <div className="rounded-xl p-4 text-5xl font-bold">
                            Book Your Stay
                        </div>
                        <div className="w-full m-5">
                            <ul className=" w-full steps steps-vertical lg:steps-horizontal">
                                {
                                    step >= 1 ?
                                    <li className="step step-primary">Search</li> : <li className="step">Search</li>
                                }
                                {
                                    step >= 2 ?
                                    <li className="step step-primary">Select Room</li> : <li className="step">Select Room</li>
                                }
                                {
                                    step >= 3 ?
                                    <li className="step step-primary">Facility</li> : <li className="step">Facility</li>
                                }
                                {
                                    step >= 4 ?
                                    <li className="step step-primary">Confirmation</li> : <li className="step">Confirmation</li>
                                }
                            </ul>

                        </div>
                    </div>
                </div>
                {
                    step === 1 ?
                    <div className="flex items-center mt-5 mx-5">
                        <div className="bg-base-100 card mt-5 shadow-2xl w-full flex justify-between items-center flex-col px-5 py-2">
                            <div className='p-3 bg-base-100 rounded-xl flex flex-col items-center justify-center gap-4 lg:w-8/12  w-full'>
                                <div className="form-control w-full sm:hidden">
                                    Search Room
                                </div>
                                <div className="divider sm:divider-horizontal divider-vertical m-1 sm:hidden"></div> 
                                <div className="form-control w-full">
                                    <Datepicker 
                                        inputClassName='btn btn-outline w-full'
                                        minDate={year + '-' + month + '-' + day} 
                                        value={value} 
                                        placeholder='Check In ~ Check Out Date'
                                        startFrom={year + '-' + month + '-' + day} 
                                        useRange={false}
                                        displayFormat='D MMM YYYY'
                                        onChange={handleValueChange} 
                                        /> 
                                </div>
                                <div className="divider sm:divider-horizontal divider-vertical m-1"></div> 
                                    <details className="dropdown w-full">
                                        <summary className="m-1 btn btn-outline w-full whitespace-nowrap ">{dewasa + " Adults | " + anak + " Children | " + kamar + " rooms"  }</summary>
                                        <ul tabIndex={0} className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                                            <li>
                                                <div className="justify-between">
                                                    Adults
                                                    <input type="number" placeholder="1" min="1" className="input input-bordered w-14 p-2 text-center" value={dewasa} onChange={(e)=>setDewasa(e.target.value)}/>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="justify-between">
                                                    Children
                                                    <input type="number" placeholder="0" min="0" className="input input-bordered w-14 p-2 text-center" value={anak} onChange={(e)=>setAnak(e.target.value)}/>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="justify-between">
                                                    Rooms
                                                    <input type="number" placeholder="1" min="1" className="input input-bordered w-14 p-2 text-center" value={kamar} onChange={(e)=>setKamar(e.target.value)}/>
                                                </div>
                                            </li>
                                        </ul>
                                    </details>
                                <div className="divider sm:divider-horizontal divider-vertical m-1"></div> 
                                <div className='form-controll w-full'>
                                    <Link className='btn btn-primary w-full' onClick={(e)=>searchRoom(e)}>Search</Link>
                                </div>
                            </div>
                        </div>
                    </div> : ""
                }
                {
                    step === 2 ?
                    <div className="flex items-center mt-5 mx-5">
                        <div className="bg-base-100 card mt-5 shadow-2xl w-full  px-5 py-2 ">
                            <div className="btn btn-primary my-5 w-28" onClick={()=>setStep(1)}>{"<< Back"}</div>
                            <div className="flex justify-between items-center w-full flex-col gap-5">
                                {
                                    availableRooms
                                    .filter(room => room.jumlah_kamar_tersedia > 0)
                                    .map((room, index) => {
                                        const roomType = roomTypeImages[room.nama_jenis_kamar]
                                        const matchedRoomRate = roomRates.find(rate => rate.nama_jenis_kamar === room.nama_jenis_kamar);
                                        return (
                                            <div key={index} className="card lg:card-side bg-base-100 shadow-xl w-full">
                                                
                                                <figure><img className="lg:max-h-96" src={roomType} alt="Superior"/></figure>
                                                <div className="card-body">
                                                    <h2 className="card-title">{room.nama_jenis_kamar}</h2>
                                                    <p>{room.deskripsi}</p>
                                                    <div className="flex gap-2 justify-center items-center">
                                                        <FontAwesomeIcon icon="wifi"/><p>{room.fitur.Internet}</p>
                                                    </div>
                                                    <div className="flex gap-2 justify-center items-center">
                                                        <FontAwesomeIcon icon="tv"/><p>{room.fitur.Hiburan}</p>
                                                    </div>
                                                    <div className="flex gap-2 justify-center items-center">
                                                        <FontAwesomeIcon icon="mug-hot"/><p>{room.fitur['Makan Minum']}</p>
                                                    </div>
                                                    <div className="flex gap-2 justify-center items-center">
                                                        <FontAwesomeIcon icon="bed"/><p>{room.fitur['Untuk tidur']}</p>
                                                    </div>
                                                    <div className="flex gap-2 justify-center items-center">
                                                        <FontAwesomeIcon icon="bath"/><p>{room.fitur['Kamar Mandi']}</p>
                                                    </div>
                                                    <div className="flex gap-2 justify-center items-center">
                                                        <FontAwesomeIcon icon="gear"/><p>{room.fitur['Kemudahan']}</p>
                                                    </div>
                                                    <div className="flex gap-2 justify-center items-center">
                                                        <FontAwesomeIcon icon="couch"/><p>{room.fitur['Kenyamanan']}</p>
                                                    </div>
                                                    
                                                </div>
                                                <div className="divider sm:divider-horizontal divider-vertical" style={{margin:'0px'}}></div> 
                                                <div className="card-body p-2 my-5">
                                                    <div className="card-actions justify-end flex-col">
                                                        <p className="font-bold">Price</p>
                                                        <div className="flex gap-1">
                                                            <p className="font-bold text-xl">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(matchedRoomRate.harga)}</p>
                                                            <p>{'/night'}</p>
                                                        </div>
                                                        <p>*the price does not include a 10% tax</p>
                                                        <br></br>
                                                        <div className="w-full flex justify-center items-center flex-col">
                                                            <p className="font-bold">Room to order</p>
                                                            <div className="join">
                                                                <button className="btn join-item" onClick={(e) => decrement(e, room.nama_jenis_kamar)}>-</button>
                                                                <input
                                                                    readOnly
                                                                    type="text"
                                                                    placeholder="0"
                                                                    min="0"
                                                                    style={{ borderRadius: "0" }}
                                                                    className="input input-bordered w-14 p-2 text-center"
                                                                    value={roomData[room.nama_jenis_kamar].count}
                                                                    onChange={(e) => handleChange(e, room.nama_jenis_kamar, matchedRoomRate.id)}
                                                                />
                                                                <button className="btn join-item" onClick={(e) => increment(e, room.nama_jenis_kamar, room.jumlah_kamar_tersedia, matchedRoomRate.id)}>+</button>
                                                            </div>
                                                            <p className="text-red-500">{room.jumlah_kamar_tersedia} rooms left</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        )
                                    })
                                }
                            </div>
                            <div className="w-full flex flex-row justify-end">
                                {
                                    roomData.Superior.count > 0 || roomData["Double Deluxe"].count > 0 || roomData["Exclusive Deluxe"].count > 0 || roomData["Junior Suite"].count > 0 ?
                                    <div className="btn btn-primary my-5 w-28" onClick={()=>setStep(3)}>{"Next >>"}</div> : <div className="btn btn-primary my-5 w-44" disabled onClick={()=>setStep(3)}>{"Select room"}</div>
                                }
                            </div>
                        </div>
                    </div>
                    : ""
                }
                {
                    step === 3 ?
                    <div className="flex items-center mt-5 mx-5">
                        <div className="bg-base-100 card mt-5 shadow-2xl w-full  px-5 py-2 ">
                            <div className="btn btn-primary my-5 w-28" onClick={()=>setStep(2)}>{"<< Back"}</div>
                            <div className="flex justify-between items-center w-full flex-col gap-5">
                            <div className="overflow-x-auto w-full">
                                <table className="table w-full flex justify-center items-center">
                                    {/* head */}
                                    <thead>
                                    <tr>
                                        <th>Facility</th>
                                        <th>Unit</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                {
                                    fasilitas
                                    .map((item) => {
   
                                        return (
                                            <tr key={item.id} className="p-2">
                                                <td className="text-lg font-semibold p-5">
                                                    {item.nama_fasilitas}
                                                </td>
                                                <td></td>
                                                <td className="text-lg font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.harga)}</td>
                                                <div className="join">
                                                    <button className="btn join-item" onClick={() => updateQuantity(item.id, getQuantityForItem(item.id) - 1)}>-</button>
                                                    <input
                                                        readOnly
                                                        type="text"
                                                        placeholder="0"
                                                        min="0"
                                                        style={{ borderRadius: "0" }}
                                                        className="input input-bordered w-14 p-2 text-center"
                                                        value={getQuantityForItem(item.id)}
                                                    />
                                                    <button className="btn join-item" onClick={() => updateQuantity(item.id, getQuantityForItem(item.id) + 1)}>+</button>
                                                </div>
                                            </tr>

                                        )
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
                            <div className="w-full flex flex-row justify-end">
                                {
                                    selectedFasilitas.length != 0 ?
                                    <div className="btn btn-primary my-5 w-28" onClick={()=>setStep(4)}>{"Next >>"}</div> : <div className="btn btn-primary my-5 w-28" onClick={()=>setStep(4)}>{"Skip >>"}</div>
                                }
                            </div>
                        </div>
                    </div>
                    : ""
                }
                {
                    step === 4 ?
                    <div className="flex items-center mt-5 mx-5">
                        <div className="bg-base-100 card mt-5 shadow-2xl w-full flex justify-between flex-col px-5 py-2">
                            <div className="btn btn-primary my-5 w-28" onClick={()=>setStep(3)}>{"<< Back"}</div>
                                <div className="rounded-xl p-4 text-2xl font-bold">
                                    Confirm your booking
                                </div>
                                <div className="w-full card  border-2 p-5">
                                    <h3 className="font-bold text-lg">Booking Detail</h3>
                                    <hr className="border-gray-400 my-2" />
                                    <div className="grid grid-cols-3 gap-2">
                                        <h5 className="text-md text-inherit font-bold">Check In</h5>
                                        <h5 className="col-span-2 text-md text-current font-semibold">{new Intl.DateTimeFormat('en-GB', { dateStyle: 'full'}).format(new Date(value.startDate))}</h5>
                                        <h5 className="text-md text-inherit font-bold">Check Out</h5>
                                        <h5 className="col-span-2 text-md text-current font-semibold">{new Intl.DateTimeFormat('en-GB', { dateStyle: 'full'}).format(new Date(value.endDate))}</h5>
                                        <h5 className="text-md text-inherit font-bold">Adults</h5>
                                        <h5 className="col-span-2 text-md text-current font-semibold">{dewasa}</h5>
                                        <h5 className="text-md text-inherit font-bold">Children</h5>
                                        <h5 className="col-span-2 text-md text-current font-semibold">{anak}</h5>
                                    </div>
                                    <hr className="border-gray-400 my-2" />
                                    <h3 className="font-bold text-lg mt-2">Room Detail</h3>
                                    <hr className="border-gray-400 my-2" />
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Room Type</th>
                                                <th>Amount</th>
                                                <th>Price</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                availableRooms.map((room, index) => {
                                                    return (
                                                        <>
                                                            {
                                                                roomData[room.nama_jenis_kamar].count > 0 ?
                                                                <tr >
                                                                    <td>{room.nama_jenis_kamar}</td>
                                                                    <td>{roomData[room.nama_jenis_kamar].count}</td>
                                                                    <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(roomRates[index].harga)}</td>
                                                                    <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(roomRates[index].harga * roomData[room.nama_jenis_kamar].count)}</td>
                                                                    
                                                                </tr>
                                                                : ""

                                                            }
                                                        </>
                                                    )
                                                })
                                            }
                                            <tr >
                                                <td> </td>
                                                <td> </td>
                                                <td> </td>
                                                <td className="font-bold text-md">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    
                                    <hr className="border-gray-400 my-2" />
                                    <h3 className="font-bold text-lg mt-2">Facility Detail</h3>
                                    <hr className="border-gray-400 my-2" />
                                    {
                                        selectedFasilitas.length != 0 ?
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Room Type</th>
                                                    <th>Amount</th>
                                                    <th>Price</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    selectedFasilitas.map((item) => {
                                                        return (
                                                            <tr >
                                                                <td>{item.nama_fasilitas}</td>
                                                                <td>{item.quantity}</td>
                                                                <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.harga)}</td>
                                                                <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.harga * item.quantity)}</td>
                                                                
                                                            </tr>
                                                        )
                                                    })
                                                }
                                                <tr >
                                                    <td> </td>
                                                    <td> </td>
                                                    <td> </td>
                                                    <td className="font-bold text-md">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalFasilitas)}</td>
                                                </tr>
                                            </tbody>
                                        </table> 
                                        :
                                        <p className="text-center">No facility selected</p>
                                    }
                                    <hr className="border-gray-400 my-2" />
                                    <div className="w-full flex flex-row justify-center">
                                        <div className="btn btn-primary w-full lg:w-2/5" onClick={confirm}>Confirm</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    : ""
                }
            </div>
            <LoadingModal />
            <Error id="error_input_date" title="You must enter check in and check out date" message="" button={"i am sorry"} onClick={()=>document.getElementById("error_input_date").close()}/>
            <Error id="success" hideCloseButton={true} title="Reservation Booked" message="Thank you for choosing Grand Atma Hotel for your recent stay in Yogyakarta. 
            
            Please note that our check-in time is 2:00 PM and check-out time is 12:00 PM. 
            
            If you have any special requests or need to modify or cancel your reservation, please contact us at support@gah.com." button={"Wonderfull"} onClick={()=>(document.getElementById("success").close(), navigate("/dashboard"))}/>        </>
    )
}

export default Booking;