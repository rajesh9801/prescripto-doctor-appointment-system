import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';


const Navbar = () => {

    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const { token, setToken, user , setUser} = useContext(AppContext);
    const logout = () => {
        setToken(false)
        localStorage.removeItem('token')
    }

    return (
        <div className='flex relative items-center justify-between text-sm py-4 mb-5 border-b  border-b-gray-400'>
            <img onClick={() => navigate('/')} className='w-44 cursor-pointer ' src={assets.logo} alt="" />
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to={'/'} >
                    <li className='py-1'>HOME </li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to={'/doctors'}>
                    <li className='py-1'>ALLDOCTORS </li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to={'/about'}>
                    <li className='py-1'>ABOUT </li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
                <NavLink to={'/contact'}>
                    <li className='py-1'>CONTACT </li>
                    <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                </NavLink>
            </ul>
            <div className='flex  z-10 items-center gap-4'>
                {
                    token ?
                        <div className='flex items-center gap-2 cursor-pointer group relative'>
                            <img className='w-8 rounded-full' src={user?.image || assets.profile_pic} alt='' />
                            <img className='w-2.5' src={assets.dropdown_icon}></img>
                            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block ' >
                                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                    <p onClick={() => navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                    <p onClick={() => navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                                    <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                                </div>
                            </div>
                        </div>
                        : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full fint-light '>Create Account</button>
                }
                {/* Mobile Menu Button */}
                <img
                    onClick={() => setShowMenu(true)}
                    className="w-6 md:hidden cursor-pointer"
                    src={assets.menu_icon}
                    alt="menu"
                />

                {/* Mobile Menu */}
                <div
                    className={`fixed top-0 right-0 max-h-fit bg-white shadow-lg z-0 transform transition-transform duration-300 ease-in-out 
  ${showMenu ? "translate-x-0 w-auto max-w-fit" : "translate-x-full w-0"} md:hidden`}
                >
                    <div className="flex items-center justify-end p-4 ">

                        <img
                            src={assets.cross_icon}
                            onClick={() => setShowMenu(false)}
                            className="w-6 cursor-pointer "
                            alt="close"
                        />
                    </div>

                    <ul className="flex flex-col items-start gap-6 p-6 font-medium text-lg">
                        <NavLink to={"/"} onClick={() => setShowMenu(false)}>
                            <li className="hover:text-primary transition">HOME</li>
                        </NavLink>
                        <NavLink to={"/doctors"} onClick={() => setShowMenu(false)}>
                            <li className="hover:text-primary transition">ALL DOCTORS</li>
                        </NavLink>
                        <NavLink to={"/about"} onClick={() => setShowMenu(false)}>
                            <li className="hover:text-primary transition">ABOUT</li>
                        </NavLink>
                        <NavLink to={"/contact"} onClick={() => setShowMenu(false)}>
                            <li className="hover:text-primary transition">CONTACT</li>
                        </NavLink>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar 
