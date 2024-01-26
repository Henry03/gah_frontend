function DeleteModal({id, title, message, onClick}) {
    return (
        <dialog id={id} className="modal">
            <div className="modal-box flex flex-col">
                <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4">{message}</p>
                <div className="modal-action gap-2">
                    <form method="dialog gap-2">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn">Close</button>
                        <button className="btn btn-warning ms-3" onClick={onClick}>Yeap</button>
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