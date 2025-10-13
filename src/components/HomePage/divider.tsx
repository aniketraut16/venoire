import React from 'react'

export default function Divider() {
  return (
    <div className="relative flex items-center mx-auto max-w-7xl px-4 py-10">
    <hr className="flex-grow border-t-2 border-gray-200" />
    <img
        src="/logo-v2.png"
        alt="divider"
        className="mx-4 z-10 bg-white px-2 py-1 h-15 w-auto object-contain"
        style={{ position: "relative", top: 0 }}
    />
    <hr className="flex-grow border-t-2 border-gray-200" />
</div>
  )
}
