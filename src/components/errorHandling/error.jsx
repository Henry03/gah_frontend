function Error ({id, title, message, button, onClick, link}) {

    return (
        <dialog id={id} className="modal">
            <div className="modal-box flex flex-col">
                <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4">{message}</p>
                <button className="btn btn-primary" to={link} onClick={onClick}>{button}</button>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button ></button>
            </form>
        </dialog>
    )
}

export default Error