import { Link } from "react-router-dom";

function SuccessModal({id, message, title, button, link, onClick}) {
    return (
        <>
            <dialog id={id} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <p className="py-4">{message}</p>
                    <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <a className="btn btn-primary" href={link} onClick={onClick}>{button}</a>
                    </form>
                    </div>
                </div>
            </dialog>
        </>
    );
}

export default SuccessModal;