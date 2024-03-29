import { Link } from "react-router-dom"
import { MdOutlineBedroomParent, MdOutlinePriceChange, MdOutlineStickyNote2} from "react-icons/md"
import { IoSnowSharp } from "react-icons/io5"
import { RiHotelLine} from "react-icons/ri"
import { TbReportAnalytics, TbUsersGroup} from "react-icons/tb"
import { CgNotes } from "react-icons/cg";
import axios from "axios"
import { useEffect, useState } from "react"


function PegawaiSidebar ({ children, role }) {

    return(
        <>
            <div className="drawer lg:drawer-open bg-base-200">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    { children }
                </div> 
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label> 
                    
                    <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content">
                    {/* Sidebar content here */}
                    <li><a className="btn btn-ghost normal-case text-xl lg:hidden">Grand Atma Hotel</a></li>
                    {
                        role == 2 ?
                        <>
                            <li><Link to="/room"><MdOutlineBedroomParent size="20"/>Room</Link></li>
                        </>
                        : ""
                    }
                    {
                        role == 3 || role == 1?
                        <>
                            <li><Link to="/pegawai/dashboard"><TbReportAnalytics size="20"/>Report</Link></li>
                        </>
                        : ""
                    }
                    {
                        role == 4 ?
                        <>
                            <li><Link to="/season"><IoSnowSharp size="20"/>Season</Link></li>
                            <li><Link to="/tarif"><MdOutlinePriceChange size="20"/>Price</Link></li>
                            <li><Link to="/facility"><RiHotelLine size="20"/>Facility</Link></li>
                            <li><Link to="/customer/grup"><TbUsersGroup size="20"/>Customer Grup</Link></li>
                            <li><Link to="/reservation"><MdOutlineStickyNote2 size="20"/>Reservation</Link></li>
                        </>
                        : ""
                    }
                    {
                        role == 5 ?
                        <>
                            <li><Link to="/transaction"><CgNotes size="20"/>Transaction</Link></li>
                        </>
                        : ""
                    }
                    </ul>
                
                </div>
            </div>
            
        </>
    )
}

export default PegawaiSidebar