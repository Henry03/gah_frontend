import SwitchMode from "./switchMode";
import { Link } from 'react-router-dom';
import Assets from '../assets/Linguini.png';

const NavBar = () => {

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    return(
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <a className="btn btn-ghost normal-case text-xl">Grand Atma Hotel</a>
            </div>
            <div className="flex-none gap-2">
                <SwitchMode />
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                <Link to="/login" className="btn btn-outline">Login</Link>
            </div>
        </div>
    )
}

export default NavBar;