'use client'
import React from 'react'
import { motion } from 'framer-motion'

export default function SignInRequest() {
  return (
    <section className="relative h-[60vh] sm:h-[65vh] md:h-[70vh] overflow-hidden py-8 sm:py-12 md:py-16 flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/banner2.png"
          alt="Person reading"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>
      <div className="relative z-10 flex justify-center md:justify-end w-full h-full items-center px-4 sm:px-6 md:pr-8 lg:pr-16">
        <motion.div 
          className='bg-yellow-300 rounded-md p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-center shadow-2xl max-w-xl w-full'
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Logo and Member Text */}
          <div className="flex items-center mb-4 sm:mb-5 md:mb-6">
            <img src="/logo.png" alt="Logo" className='object-contain h-8 sm:h-9 md:h-10 w-auto mr-2' />
          </div>
          
          {/* Main Heading */}
          <h2 className='text-blue-950 text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-1'>EARN POINTS</h2>
          <h3 className='text-blue-950 text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4'>ON EVERY PURCHASE</h3>
          
          {/* Description */}
          <p className='text-blue-950 text-sm sm:text-base md:text-md leading-relaxed mb-4 sm:mb-5 md:mb-6'>Register with us to get updates and spend your point to buy.</p>
          
          {/* Sign Up Button */}
          <button className='bg-blue-950 text-yellow-400 px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base md:text-md uppercase hover:bg-blue-900 transition-colors duration-300 shadow-lg w-full sm:w-3/4 md:w-2/3 mx-auto'>
            SIGN UP NOW
          </button>
        </motion.div>
      </div>
    </section>
  )
}
