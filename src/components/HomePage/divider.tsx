import React from 'react'

export default function Divider() {
  return (
    <div className="relative flex items-center mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-6">
      <hr className="grow border-t border-gray-200 sm:border-t-2" />
      <img
        src="/logo-v2.png"
        alt="divider"
        className="mx-2 sm:mx-3 md:mx-4 z-10 bg-white px-1 sm:px-2 py-0.5 sm:py-1 h-10 sm:h-12 md:h-15 w-auto object-contain"
        style={{ position: "relative", top: 0 }}
      />
      <hr className="grow border-t border-gray-200 sm:border-t-2" />
    </div>
  )
}
