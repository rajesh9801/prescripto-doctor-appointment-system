import React from 'react'
import { assets } from '../assets/assets'

function About() {
  return (
    <div className="px-6 md:px-12 lg:px-20">
      {/* Section Heading */}
      <div className="text-center pt-10">
        <p className="text-2xl text-gray-500">
          ABOUT <span className="text-gray-700 font-semibold">US</span>
        </p>
      </div>

      {/* Content Section */}
      <div className="flex flex-col md:flex-row items-center my-12 gap-12">
        {/* Left Image */}
        <img
          className="w-full md:max-w-[360px] rounded-lg shadow-md"
          src={assets.about_image}
          alt="About Prescripto"
        />

        {/* Right Content */}
        <div className="flex flex-col justify-center gap-6 md:w-2/3 text-sm text-gray-600 leading-relaxed">
          <p>
            Welcome to <span className="font-semibold text-gray-800">Prescripto</span>, 
            your trusted partner in managing your healthcare needs conveniently and efficiently. 
            At Prescripto, we understand the challenges individuals face when it comes to scheduling 
            doctor appointments and managing their health records.
          </p>
          <p>
            Prescripto is committed to excellence in healthcare technology. We continuously strive 
            to enhance our platform, integrating the latest advancements to improve user experience 
            and deliver superior service. Whether you're booking your first appointment or managing 
            ongoing care, Prescripto is here to support you every step of the way.
          </p>
          <h3 className="text-lg font-semibold text-gray-800">Our Vision</h3>
          <p>
            Our vision at Prescripto is to create a seamless healthcare experience for every user. 
            We aim to bridge the gap between patients and healthcare providers, making it easier 
            for you to access the care you need, when you need it.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="my-16">
        <h2 className="text-xl font-semibold text-gray-700 mb-10 text-center">
          WHY <span className="text-gray-900">CHOOSE US</span>
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <div className="border rounded-xl px-8 py-10 flex flex-col gap-4 text-[15px] text-gray-600 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
            <b className="font-semibold">EFFICIENCY:</b>
            <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
          </div>

          {/* Card 2 */}
          <div className="border rounded-xl px-8 py-10 flex flex-col gap-4 text-[15px] text-gray-600 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
            <b className="font-semibold">CONVENIENCE:</b>
            <p>Access to a network of trusted healthcare professionals in your area.</p>
          </div>

          {/* Card 3 */}
          <div className="border rounded-xl px-8 py-10 flex flex-col gap-4 text-[15px] text-gray-600 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">
            <b className="font-semibold">PERSONALIZATION:</b>
            <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
