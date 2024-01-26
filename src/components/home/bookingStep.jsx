function BookingStep ({step}) {
    if(step == 1) {
        return (
            <div>
                <ul className="steps w-full">
                    <li className="step step-primary">Booking</li>
                    <li className="step">Bail Money</li>
                    <li className="step">Check In</li>
                    <li className="step">Completed</li>
                </ul>
            </div>
        )
    }else if(step == 2) {
        return (
            <div>
                <ul className="steps w-full">
                    <li className="step step-primary">Booking</li>
                    <li className="step step-primary">Bail Money</li>
                    <li className="step">Check In</li>
                    <li className="step">Completed</li>
                </ul>
            </div>
        )
    }else if(step == 3) {
        return (
            <div>
                <ul className="steps w-full">
                    <li className="step step-primary">Booking</li>
                    <li className="step step-primary">Bail Money</li>
                    <li className="step step-primary">Check In</li>
                    <li className="step">Completed</li>
                </ul>
            </div>
        )
    }else{
        return (
            <div>
                <ul className="steps w-full">
                    <li className="step step-primary">Booking</li>
                    <li className="step step-primary">Bail Money</li>
                    <li className="step step-primary">Check In</li>
                    <li className="step step-primary">Completed</li>
                </ul>
            </div>
        )
    }
}

export default BookingStep