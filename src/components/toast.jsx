function Toast({message}){
    return(
        <div className="toast">
            <div className="alert alert-info">
                <span>{message}</span>
            </div>
        </div>
    )
}

export default Toast;