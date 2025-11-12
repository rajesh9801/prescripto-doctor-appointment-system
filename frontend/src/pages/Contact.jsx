import React from 'react'
import { assets } from '../assets/assets'

function Contact() {
  return (
    <div className="px-6 md:px-12 lg:px-20 py-12">
      {/* Section Heading */}
      <div className="text-center mb-12">
        <p className="text-2xl text-gray-500">
          CONTACT <span className="text-gray-700 font-semibold">US</span>
        </p>
      </div>

      {/* Contact Section */}
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Left Image */}
        <img
          src={assets.contact_image}
          alt="Contact"
          className="w-full md:max-w-[400px] rounded-lg shadow-md"
        />

        {/* Right Content */}
        <div className="flex flex-col gap-8 text-gray-600">
          {/* Office Info */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">OUR OFFICE</h4>
            <div className="space-y-1 text-sm">
              <p>2nd Floor, Orchid Business Park</p>
              <p>Sector 48, Sohna Road, Gurugram, Haryana, India</p>
              <p>PIN: 122018</p>
            </div>
            <div className="mt-4 space-y-1 text-sm">
              <p>Tel: <span className="font-medium">+91 7700882143</span></p>
              <p>Email: <span className="font-medium">support@prescripto.in</span></p>
            </div>
          </div>

          {/* Careers */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">CAREERS AT PRESCRIPTO</h4>
            <p className="text-sm">
              Learn more about our teams and job openings in India.
            </p>
          </div>

          {/* Button */}
          <button className="w-fit px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg shadow hover:bg-primary/90 transition-all duration-300">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  )
}

export default Contact
