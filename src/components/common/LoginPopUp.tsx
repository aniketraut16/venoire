'use client'
import React, { useState } from 'react'
import { X } from 'lucide-react'

interface LoginPopUpProps {
  isOpen: boolean
  onClose: () => void
  onLogin?: () => void
}

export default function LoginPopUp({ isOpen, onClose, onLogin }: LoginPopUpProps) {
  const [mobileNumber, setMobileNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)


  const handleGetOTP = async () => {
    if (mobileNumber.length !== 10) {
      alert('Please enter a valid 10-digit mobile number')
      return
    }
    
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert('OTP sent successfully!')
      // Simulate successful login for demo
      if (onLogin) {
        onLogin()
      }
      onClose()
    }, 2000)
  }

  const handleGoogleLogin = () => {
    // Implement Google login logic
    console.log('Google login clicked')
    // Simulate successful login for demo
    if (onLogin) {
      onLogin()
    }
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        data-lenis-prevent="true"
        className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Login Modal */}
      <div data-lenis-prevent="true" className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in slide-in-from-top-4 duration-300"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="relative p-6 pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-amber-600 mb-2 tracking-wide">
                LOG IN / SIGN UP
              </h1>
              <p className="text-gray-700 text-base">
                Join Now for Seamless Shopping Experience
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="px-6 pb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">Easy order tracking</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">Manage return and exchange within 15-days</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                </div>
                <span className="text-gray-700 text-sm">Exclusive deals and additional benefit</span>
              </div>
            </div>
          </div>

          {/* Mobile Number Input */}
          <div className="px-6 pb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              MOBILE NUMBER*
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                <span className="text-gray-600 text-sm font-medium">+91</span>
                <div className="w-px h-4 bg-gray-300 mx-3"></div>
              </div>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter 10 digit mobile number"
                className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                maxLength={10}
              />
            </div>
          </div>

          {/* Terms */}
          <div className="px-6 pb-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              By Continuing, I agree to the{' '}
              <a href="#" className="text-amber-600 underline hover:text-amber-700">
                Terms & Conditions
              </a>{' '}
              &{' '}
              <a href="#" className="text-amber-600 underline hover:text-amber-700">
                Privacy Policy
              </a>
            </p>
          </div>

          {/* Get OTP Button */}
          <div className="px-6 pb-6">
            <button
              onClick={handleGetOTP}
              disabled={isLoading || mobileNumber.length !== 10}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium text-sm tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  SENDING OTP...
                </>
              ) : (
                'GET OTP'
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="px-6 pb-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
              </div>
            </div>
          </div>

          {/* Google Login */}
          <div className="px-6 pb-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
