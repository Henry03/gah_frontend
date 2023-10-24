import { Link } from "react-router-dom";

function SuccessModal({message, title, button, link, onClick}) {
    return (
        <>
            <dialog id="success_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <p className="py-4">{message}</p>
                    <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-primary" to={link} onClick={onClick}>{button}</button>
                    </form>
                    </div>
                </div>
            </dialog>
        </>
    );
}

export default SuccessModal;