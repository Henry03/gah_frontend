import SwitchMode from "../switchMode";
import { Link } from 'react-router-dom';
import Assets from '../../assets/Linguini.png';
import {FiMenu} from 'react-icons/fi'

const PegawaiNavbar = () => {

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    return(
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <label htmlFor="my-drawer-2" className="btn drawer-button lg:hidden"><FiMenu/></label>
                <a className="btn btn-ghost text-xl hidden lg:block" style={{lineHeight:'2.7rem'}}>Grand Atma Hotel</a>
            </div>
            <div className="flex-none gap-2">
                <SwitchMode />
                    <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                        <img src={Assets} />
                        </div>
                    </label>
                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                        <li>
                        <Link className="justify-between" to="/pegawai/profile">
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

export default PegawaiNavbar;