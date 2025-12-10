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
      <div data-lenis-prevent="true" className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center md:p-4">
        <div 
          className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full h-[70vh] md:h-auto md:max-w-md md:max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom md:slide-in-from-top-4 duration-300"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="relative px-8 pt-8 pb-6">
            <button
              onClick={onClose}
              className="absolute top-6 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
            
            <div className="text-center">
              <h1 className="text-[#D4AF37] text-xl font-semibold mb-3 tracking-wider">
                {isOTPMode ? 'VERIFY OTP' : 'LOG IN / SIGN UP'}
              </h1>
              <p className="text-gray-900 text-base font-normal">
                {isOTPMode ? 'Enter the code sent to your email' : 'Join Now for Seamless Shopping Experience'}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-8 mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Benefits */}
          <div className="px-8 pb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-black mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-gray-900 text-base leading-relaxed">Easy order tracking</span>
              </div>
              
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-black mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-gray-900 text-base leading-relaxed">Manage return and exchange within 15-days</span>
              </div>
              
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-black mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-gray-900 text-base leading-relaxed">Exclusive deals and additional benefit</span>
              </div>
            </div>
          </div>

          {isOTPMode ? (
            <>
              {/* OTP Verification Screen */}
              <div className="px-8 pb-6">
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
                  <label className="block text-xs font-medium text-gray-500 mb-2 tracking-wide uppercase">
                    ENTER OTP*
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-center text-2xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    required
                    onFocus={(e) => e.target.select()}
                  />
                  
                  <button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full bg-black text-[#D4AF37] py-4 px-4 rounded-lg font-semibold text-base tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#D4AF37] mr-2"></div>
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
                      className="text-gray-700 hover:underline text-sm font-medium"
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
              <div className="px-8 pb-6">
                <form onSubmit={handleSendOTP}>
                  <label className="block text-xs font-medium text-gray-500 mb-2 tracking-wide uppercase">
                    EMAIL ADDRESS*
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 text-base text-gray-900"
                      required
                    />
                  </div>

                  {/* Terms */}
                  <div className="mt-6 mb-6">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      By Continuing, I agree to the{' '}
                      <a href="#" className="text-[#D4AF37] underline hover:text-[#C5A028]">
                        Terms & Conditions
                      </a>{' '}
                      &{' '}
                      <a href="#" className="text-[#D4AF37] underline hover:text-[#C5A028]">
                        Privacy Policy
                      </a>
                    </p>
                  </div>

                  {/* Send OTP Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full bg-black text-[#D4AF37] py-4 px-4 rounded-lg font-semibold text-base tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#D4AF37] mr-2"></div>
                        SENDING OTP...
                      </>
                    ) : (
                      'GET OTP'
                    )}
                  </button>
                </form>
              </div>
            </>
          )}

          {!isOTPMode && (
            <>
              {/* Divider */}
              <div className="px-8 pb-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-900 font-semibold">OR</span>
                  </div>
                </div>
              </div>

              {/* Google Login */}
              <div className="px-8 pb-8">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full border-2 border-gray-300 text-gray-900 py-3.5 px-4 rounded-lg font-medium text-base hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
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
