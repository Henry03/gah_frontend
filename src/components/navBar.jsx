import SwitchMode from "./switchMode";
import { Link } from 'react-router-dom';

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
                <div className="form-control">
                    <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                </div>
                    <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                        <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
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

export default NavBar;