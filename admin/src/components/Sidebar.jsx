import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'

const Sidebar = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  // common link styles
  const linkClasses =
    "flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer hover:bg-gray-100 transition-colors"
  const activeClasses =
    "bg-[#F2F3FF] border-r-4 border-blue-500 text-blue-600 font-medium"

  return (
    <div className="min-h-screen bg-white border-r">
      {aToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : ""}`
            }
          >
            <img src={assets.home_icon} alt="Dashboard" className="w-5 h-5" />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          <NavLink
            to="/all-appointments"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : ""}`
            }
          >
            <img src={assets.appointment_icon} alt="Appointments" className="w-5 h-5" />
            <p className='hidden md:block'>Appointments</p>
          </NavLink>

          <NavLink
            to="/add-doctor"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : ""}`
            }
          >
            <img src={assets.add_icon} alt="Add Doctor" className="w-5 h-5" />
            <p className='hidden md:block' >Add Doctor</p>
          </NavLink>

          <NavLink
            to="/doctor-list"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : ""}`
            }
          >
            <img src={assets.people_icon} alt="Doctor List" className="w-5 h-5" />
            <p className='hidden md:block'>Doctor List</p>
          </NavLink>
        </ul>
      )}

      {dToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            to="/doctor-dashboard"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : ""}`
            }
          >
            <img src={assets.home_icon} alt="Dashboard" className="w-5 h-5" />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          <NavLink
            to="/doctor-appointments"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : ""}`
            }
          >
            <img src={assets.appointment_icon} alt="Appointments" className="w-5 h-5" />
            <p className='hidden md:block'>Appointments</p>
          </NavLink>

          <NavLink
            to="/doctor-profile"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : ""}`
            }
          >
            <img src={assets.add_icon} alt="Add Doctor" className="w-5 h-5" />
            <p className='hidden md:block'>Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  )
}

export default Sidebar
