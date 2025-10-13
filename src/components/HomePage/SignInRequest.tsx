import React from 'react'

export default function SignInRequest() {
  return (
    <section className="relative h-[70vh] overflow-hidden py-16 flex items-center">
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
      <div className="relative z-10 flex justify-end w-full h-full items-center pr-8 md:pr-16">
        <div className='bg-yellow-300 rounded-md p-14 flex flex-col justify-center shadow-2xl max-w-xl w-full'>
          {/* Logo and Member Text */}
          <div className="flex items-center mb-6">
            <img src="/logo.png" alt="Logo" className='object-contain h-10 w-auto mr-2' />
            {/* <span className='text-blue-950 text-xs font-semibold uppercase tracking-wide'>ALLEN SOLLY MEMBER</span> */}
          </div>
          
          {/* Main Heading */}
          <h2 className='text-blue-950 text-3xl font-bold leading-tight mb-1'>EARN POINTS</h2>
          <h3 className='text-blue-950 text-3xl font-bold mb-4'>ON EVERY PURCHASE</h3>
          
          {/* Description */}
          <p className='text-blue-950 text-md leading-relaxed mb-6'>Register with us to get updates and spend your point to buy.</p>
          
          {/* Sign Up Button */}
          <button className='bg-blue-950 text-yellow-400 px-8 py-3 rounded-lg font-bold text-md uppercase hover:bg-blue-900 transition-colors duration-300 shadow-lg w-2/3 mx-auto'>
            SIGN UP NOW
          </button>
        </div>
      </div>
    </section>
  )
}
