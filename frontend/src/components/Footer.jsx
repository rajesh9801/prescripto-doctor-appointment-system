import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">

        {/* Left Side */}
        <div>
          <div>
            <img src={assets.logo} alt="logo" className="mb-5 w-40" />
          </div>
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
          Prescripto is your trusted platform for booking medical appointments with experienced doctors. We make healthcare accessible, reliable, and convenient by connecting patients with over 100+ certified professionals across various specialties. </p>
        </div>

        {/* Center Section */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li className="cursor-pointer hover:text-gray-800">Home</li>
            <li className="cursor-pointer hover:text-gray-800">About us</li>
            <li className="cursor-pointer hover:text-gray-800">Contact us</li>
            <li className="cursor-pointer hover:text-gray-800">Privacy policy</li>
          </ul>
        </div>

        {/* Right Side */}
        <div>
          <p className= "text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li className="hover:text-gray-800">+91-7700882143</li>
            <li className="hover:text-gray-800">rk424036@gmail.com</li>
          </ul>
        </div>
      </div>
      {/* Copyright Text  */}
      <hr></hr>
      <div className='py-5 text-sm text-center'>© 2025 Prescripto. All rights reserved.</div>
    </div>

  )
}

export default Footer
