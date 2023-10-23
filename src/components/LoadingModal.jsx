

function LoadingModal({}) {
    return (
        <>
            <dialog id="loading_modal" className="modal modal-middle">
                <div className="modal-box p-32 mx-auto text-center">
                    <span className="loading loading-dots w-16"></span>
                </div>
            </dialog>
        </>
    );
}

export default LoadingModal;