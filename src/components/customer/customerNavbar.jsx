import SwitchMode from "../switchMode";
import { Link } from 'react-router-dom';
import Assets from '../../assets/Linguini.png';
import {FiMenu} from 'react-icons/fi'

const CustomerNavbar = () => {

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    return(
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                <label tabIndex={0} className="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                </label>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <li><Link to="/booking/search">Order</Link></li>
                    <li>
                    {/* <a>Parent</a>
                    <ul className="p-2">
                        <li><a>Submenu 1</a></li>
                        <li><a>Submenu 2</a></li>
                    </ul> */}
                    </li>
                    <li><Link to="/dashboard">Reservation</Link></li>
                </ul>
                </div>
                <a className="btn btn-ghost normal-case text-xl">Grand Atma Hotel</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to="/booking/search">Order</Link></li>
                    {/* <li tabIndex={0}>
                        <details>
                        <summary>Parent</summary>
                        <ul className="p-2">
                            <li><a>Submenu 1</a></li>
                            <li><a>Submenu 2</a></li>
                        </ul>
                        </details>
                    </li> */}
                    <li><Link to="/dashboard">Reservation</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <SwitchMode />
                    <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                        <img src={Assets} />
                        </div>
                    </label>
                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                        <li>
                        <Link className="justify-between" to="/profile">
                            Profile
                            <span className="badge">New</span>
                        </Link>
                        </li>
                        <li><a>Settings</a></li>
                        <li><Link onClick={(e) => logout(e)}>Logout</Link></li>
                    </ul>
                </div>
            </div>
            
        </div>
    )
}

export default CustomerNavbar;