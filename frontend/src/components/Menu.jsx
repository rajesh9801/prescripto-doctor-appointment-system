import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
const Menu = ({showMenu,setShowMenu}) => {
    
    return (

        <div >
            <img onClick={() => setShowMenu(false)} className={`w-4 ${showMenu ? "sm:flex" : "hidden "} `} src={assets.cross_icon} />
            {
                showMenu &&
                <ul className='items-start gap-5 font-medium '>
                    <NavLink to={'/'} >
                        <li className='py-1'>HOME </li>
                    </NavLink>
                    <NavLink to={'/doctors'}>
                        <li className='py-1'>ALL DOCTORS </li>
                    </NavLink>
                    <NavLink to={'/about'}>
                        <li className='py-1'>ABOUT </li>
                    </NavLink>
                    <NavLink to={'/contact'}>
                        <li className='py-1'>CONTACT </li>
                    </NavLink>
                </ul>
            }
          
        </div>

    )
}

export default Menu
