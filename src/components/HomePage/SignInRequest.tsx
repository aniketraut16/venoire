'use client'
import React from 'react'
import { motion } from 'framer-motion'

export default function SignInRequest() {
  return (
    <section className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[70vh] overflow-hidden py-6 sm:py-8 md:py-12 lg:py-16 flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/signinbanner.jpg"
          alt="Person reading"
          className="w-full h-full object-cover object-left sm:object-center"
        />
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>
      <div className="relative z-10 flex justify-center md:justify-end w-full h-full items-center px-4 sm:px-6 md:pr-8 lg:pr-16">
        <motion.div 
          className='bg-yellow-300 rounded-md p-5 sm:p-6 md:p-8 lg:p-10 xl:p-14 flex flex-col justify-center shadow-2xl max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl w-full'
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Logo and Member Text */}
          <div className="flex items-center mb-3 sm:mb-4 md:mb-5 lg:mb-6">
            <img src="/logo.png" alt="Logo" className='object-contain h-7 sm:h-8 md:h-9 lg:h-10 w-auto mr-2' />
          </div>
          
          {/* Main Heading */}
          <h2 className='text-blue-950 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight mb-0.5 sm:mb-1'>SIGN IN FOR A</h2>
          <h3 className='text-blue-950 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 md:mb-4'> BETTER EXPERIENCE</h3>
          
          {/* Description */}
          <p className='text-blue-950 text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4 md:mb-5 lg:mb-6'>Save your preferences, track orders, and get a smoother checkout every time.</p>
          
          {/* Sign Up Button */}
          <button className='bg-blue-950 text-yellow-400 px-5 sm:px-6 md:px-7 lg:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg font-bold text-xs sm:text-sm md:text-base uppercase hover:bg-blue-900 transition-colors duration-300 shadow-lg w-full sm:w-4/5 md:w-3/4 lg:w-2/3 mx-auto'>
            SIGN UP NOW
          </button>
        </motion.div>
      </div>
    </section>
  )
}
