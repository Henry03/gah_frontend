import { useEffect, useState } from "react";
import axios from "axios";
import LoadingModal from "../LoadingModal";
import Superior from '../../assets/superior.jpg'
import DoubleDeluxe from '../../assets/double_deluxe.jpg'
import ExclusiveDeluxe from '../../assets/exclusive_deluxe.jpg'
import JuniorSuite from '../../assets/junior_suite.jpg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DetailKamarModal({id = 1}) {
    const [room, setData] = useState({
        "id": 1,
        "nama_jenis_kamar": "Superior",
        "harga": 100000,
        "gambar": "superior.jpg",
        "kapasitas": 2,
        "rincian": [
            "AC",
            "Air minum kemasan gratis",
            "Brankas dalam kamar (ukuran laptop)",
            "Fasilitas membuat kopi\/teh",
            "Jubah mandi",
            "Layanan kamar (24 jam)",
            "Meja tulis",
            "Minibar",
            "Pembersihan kamar harian",
            "Pengering rambut",
            "Peralatan mandi gratis",
            "Sandal",
            "Telepon",
            "Tempat tidur ekstra (biaya tambahan)",
            "Tempat tidur premium",
            "Tirai kedap-cahaya",
            "TV kabel",
            "TV LCD",
            "Wi-Fi gratis"
        ],
        "fitur": {
            "Internet": "WiFi Gratis",
            "Hiburan": "Televisi LCD dengan channel TV premium channels",
            "Makan Minum": "Pembuat kopi\/teh, minibar, layanan kamar 24-jam, air minum kemasan gratis, termasuk sarapan",
            "Untuk tidur": "Seprai kualitas premium dan gorden\/tirai kedap cahaya",
            "Kamar Mandi": "Kamar mandi pribadi dengan shower, jubah mandi, dan sandal",
            "Kemudahan": "Brankas (muat laptop), Meja tulis, dan Telepon; tempat tidur lipat\/tambahan tersedia berdasarkan permintaan",
            "Kenyamanan": "AC dan layanan pembenahan kamar harian, Merokok\/Dilarang Merokok"
        },
        "deskripsi": "22 meter persegi",
        "created_at": null,
        "updated_at": null
    })
    const [roomImage, setRoomImage] = useState(Superior)

    const getData = () => {
        const loading = document.getElementById('loading')
        loading.showModal()
        
        axios.get('/jenis-kamar/'+id, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setData(response.data.data)
            console.log(response.data.data)
            loading.close()
        })
        .catch(error => {
            console.log(error)
            loading.close()
        })
    }

    useEffect(() => {
        if(id){
            getData()
            if(id==1){
                setRoomImage(Superior)
            }else if(id==2){
                setRoomImage(DoubleDeluxe)
            }else if(id==3){
                setRoomImage(ExclusiveDeluxe)
            }else{
                setRoomImage(JuniorSuite)
            
            }
        }
    }, [id])

    return (
        <>
            <dialog id="detail_kamar_modal" className="modal">
                <div className="modal-box no-scrollbar justi">
                    <form method="dialog" className="flex justify-center items-center">
                        <div className=" flex flex-col items-center justify-center">
                            <h2 className="card-title mb-3">{room.nama_jenis_kamar}</h2>
                        </div>
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">✕</button>
                    </form>
                    <div className="card lg:card-side bg-base-100 shadow-xl w-full">
                        
                        <figure><img className="lg:max-h-96" src={roomImage} alt="Superior"/></figure>
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
                    </div>
                    
                </div>
            </dialog>
            <LoadingModal id="loading"/>
            
        </>
    );
}

export default DetailKamarModal;