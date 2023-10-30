function DeleteModal({id, title, message, onClick}) {
    return (
        <dialog id={id} className="modal">
            <div className="modal-box flex flex-col">
                <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4">{message}</p>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn">Close</button>
                        <button className="btn" onClick={onClick}>Yeap</button>
                    </form>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button >Refresh Page</button>
            </form>
        </dialog>
    )
}

export default DeleteModal