function Success ({id, title, message, button, onClick, link, hideCloseButton=false}) {
    const messageStyle = {
        whiteSpace: "pre-line", // This CSS property preserves line breaks
      };

    return (
        <dialog id={id} className="modal">
            <div className="modal-box flex flex-col">
                <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn-sm btn-circle btn-ghost absolute right-2 top-2" hidden={hideCloseButton} >✕</button>
                </form>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="py-4" style={messageStyle}>{message}</p>
                <button className="btn btn-primary" to={link} onClick={onClick}>{button}</button>
            </div>
        </dialog>
    )
}

export default Success