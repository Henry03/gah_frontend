function RoomCard ({img, title, message, button, onClick}) {
    return (
        <div className="card w-72 bg-base-100 shadow-xl">
            <figure><img src={img} alt="Shoes" /></figure>
            <div className="card-body p-5">
                <div className="card-title flex flex-row justify-between items-center">
                    <h2 className="card-title">{title}</h2>
                    <div className="rating grid grid-flow-col gap-1 items-center">
                        <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" checked/>
                        <p className="text-base">4/5</p>
                    </div>
                </div>
                <p>{message}</p>
                <div className="card-actions justify-end">
                <button className="btn btn-primary" onClick={onClick}>Check it out</button>
                </div>
            </div>
        </div>
    )
}

export default RoomCard