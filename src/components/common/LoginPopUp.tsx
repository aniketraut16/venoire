'use client'
import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { sendOTP, verifyOTP } from '@/utils/user'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface LoginPopUpProps {
  isOpen: boolean
  onClose: () => void
  onLogin?: () => void
}

export default function LoginPopUp({ isOpen, onClose, onLogin }: LoginPopUpProps) {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isOTPMode, setIsOTPMode] = useState(false)
  const [otpToken, setOtpToken] = useState('')
  const [otpTimer, setOtpTimer] = useState(0)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const authContext = useAuth()
  const { user, loginWithGoogle, loginWithOTP, needsCompleteSetup } = authContext
  const router = useRouter()

  // OTP Timer
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [otpTimer])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail('')
      setOtp('')
      setIsOTPMode(false)
      setOtpToken('')
      setOtpTimer(0)
      setError('')
      setIsLoading(false)
    }
  }, [isOpen])

  // Handle user authentication and profile completion redirect
  useEffect(() => {
    if (user) {
      // User is authenticated, check if they need to complete profile
      if (needsCompleteSetup) {
        onClose()
        router.push('/complete-profile')
      } else {
        // Profile is complete, just close modal
        if (onLogin) {
          onLogin()
        }
        onClose()
      }
    }
  }, [user, needsCompleteSetup, onClose, onLogin, router])

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)
    try {
      const response = await sendOTP({ email })
      
      if (response.success && response.data) {
        setOtpToken(response.data.token)
        setIsOTPMode(true)
        setOtpTimer(300) // 5 minutes
        toast.success('OTP sent to your email')
      } else {
        setError(response.message || 'Failed to send OTP')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setIsLoading(true)
    try {
      const response = await verifyOTP({ token: otpToken, otp })

      if (response.success && response.data) {
        if (loginWithOTP && typeof loginWithOTP === 'function') {
          await loginWithOTP(response.data.customToken)
          toast.success('Login successful!')
          // The useEffect will handle routing based on needsCompleteSetup
        } else {
          setError('Authentication method not available. Please try again.')
        }
      } else {
        setError(response.message || 'Invalid OTP')
      }
    } catch (err: any) {
      console.error('OTP verification error:', err)
      setError(err.message || 'Failed to verify OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setError('')
    setIsLoading(true)
    
    try {
      const response = await sendOTP({ email })
      
      if (response.success && response.data) {
        setOtpToken(response.data.token)
        setOtpTimer(300)
        setOtp('')
        toast.success('New OTP sent to your email')
      } else {
        setError(response.message || 'Failed to resend OTP')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      await loginWithGoogle()
      toast.success('Login successful!')
      // The useEffect will handle routing based on needsCompleteSetup
    } catch (err: any) {
      console.error('Google login error:', err)
      setError(err.message || 'Google login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackFromOTP = () => {
    setIsOTPMode(false)
    setOtp('')
    setOtpToken('')
    setOtpTimer(0)
    setError('')
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
                {isOTPMode ? 'VERIFY OTP' : 'LOG IN / SIGN UP'}
              </h1>
              <p className="text-gray-700 text-base">
                {isOTPMode ? 'Enter the code sent to your email' : 'Join Now for Seamless Shopping Experience'}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

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

          {isOTPMode ? (
            <>
              {/* OTP Verification Screen */}
              <div className="px-6 pb-4">
                <div className="text-center mb-6">
                  <p className="text-gray-600 mb-2">
                    We've sent a 6-digit code to
                  </p>
                  <p className="font-semibold text-gray-800">{email}</p>
                  {otpTimer > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Code expires in {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}
                    </p>
                  )}
                </div>

                <form onSubmit={handleVerifyOTP}>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    ENTER OTP*
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                    onFocus={(e) => e.target.select()}
                  />
                  
                  <button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium text-sm tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-4"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        VERIFYING...
                      </>
                    ) : (
                      'VERIFY OTP'
                    )}
                  </button>
                </form>

                <div className="text-center mt-4">
                  {otpTimer > 0 ? (
                    <p className="text-sm text-gray-600">
                      Didn't receive the code?{' '}
                      <span className="text-gray-400">Resend in {otpTimer}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-amber-600 hover:underline text-sm font-medium"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={handleBackFromOTP}
                    className="text-gray-800 hover:underline text-sm font-medium"
                  >
                    Back to email entry
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Email Input Screen */}
              <div className="px-6 pb-4">
                <form onSubmit={handleSendOTP}>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    EMAIL ADDRESS*
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    We'll send a 6-digit code to your email
                  </p>

                  {/* Terms */}
                  <div className="mt-4">
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

                  {/* Send OTP Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium text-sm tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-4"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        SENDING OTP...
                      </>
                    ) : (
                      'SEND OTP'
                    )}
                  </button>
                </form>
              </div>
            </>
          )}

          {!isOTPMode && (
            <>
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
                  disabled={isLoading}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
            </>
          )}
        </div>
      </div>
    </>
  )
}
