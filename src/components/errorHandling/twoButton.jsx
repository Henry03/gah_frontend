function TwoButton ({id, title, message, button1, button2, onClick1, onClick2}) {

    return (
        <dialog id={id} className="modal">
            <div className="modal-box flex flex-col">
                <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4">{message}</p>
                <div className="w-full grid grid-flow-col grid-cols-2 gap-2">
                    <button className="btn btn-primary w-full" onClick={onClick1}>{button1}</button>
                    <button className="btn btn-warning w-full" onClick={onClick2}>{button2}</button>

                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button >Refresh Page</button>
            </form>
        </dialog>
    )
}

export default TwoButton