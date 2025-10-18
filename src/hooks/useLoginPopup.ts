'use client'
import { useState, useEffect } from 'react'

interface LoginPopupState {
  isOpen: boolean
  shouldShow: boolean
}

export const useLoginPopup = () => {
  const [state, setState] = useState<LoginPopupState>({
    isOpen: false,
    shouldShow: false
  })

  // Check if user is logged in (you can customize this logic)
  const isUserLoggedIn = (): boolean => {
    // Check for auth token, user data, etc.
    // For now, checking if there's any user data in localStorage
    const userData = localStorage.getItem('user')
    const authToken = localStorage.getItem('authToken')
    return !!(userData || authToken)
  }

  // Check if popup was shown recently (within 1 hour)
  const wasShownRecently = (): boolean => {
    const lastShown = localStorage.getItem('loginPopupLastShown')
    if (!lastShown) return false

    const lastShownTime = parseInt(lastShown)
    const oneHourAgo = Date.now() - (60 * 60 * 1000) // 1 hour in milliseconds
    
    return lastShownTime > oneHourAgo
  }

  // Check if popup should be shown
  const shouldShowPopup = (): boolean => {
    // Don't show if user is already logged in
    if (isUserLoggedIn()) {
      console.log('LoginPopup: User is already logged in, not showing popup')
      return false
    }

    // Don't show if it was shown recently (within 1 hour)
    if (wasShownRecently()) {
      console.log('LoginPopup: Popup was shown recently, not showing again')
      return false
    }

    console.log('LoginPopup: Conditions met, showing popup')
    return true
  }

  // Initialize popup state on mount
  useEffect(() => {
    // Small delay to ensure the page has loaded
    const timer = setTimeout(() => {
      const shouldShow = shouldShowPopup()
      setState({
        isOpen: shouldShow,
        shouldShow
      })
    }, 1000) // 1 second delay after page load

    return () => clearTimeout(timer)
  }, [])

  // Expose functions to window for testing (only in development)
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      (window as any).loginPopupDebug = {
        showPopup,
        resetPopupState,
        simulateLogin,
        isUserLoggedIn: isUserLoggedIn(),
        wasShownRecently: wasShownRecently(),
        getLastShownTime: () => {
          const lastShown = localStorage.getItem('loginPopupLastShown')
          return lastShown ? new Date(parseInt(lastShown)).toLocaleString() : 'Never'
        }
      }
      console.log('LoginPopup Debug: Use window.loginPopupDebug to test popup functions')
    }
  }, [])

  // Mark popup as shown when it opens
  useEffect(() => {
    if (state.isOpen && state.shouldShow) {
      localStorage.setItem('loginPopupLastShown', Date.now().toString())
      console.log('LoginPopup: Marked as shown in localStorage')
    }
  }, [state.isOpen, state.shouldShow])

  const openPopup = () => {
    setState(prev => ({ ...prev, isOpen: true }))
  }

  const closePopup = () => {
    setState(prev => ({ ...prev, isOpen: false }))
  }

  // Function to manually trigger popup (for testing or manual triggers)
  const showPopup = () => {
    setState({
      isOpen: true,
      shouldShow: true
    })
    localStorage.setItem('loginPopupLastShown', Date.now().toString())
  }

  // Function to reset popup state (for testing)
  const resetPopupState = () => {
    localStorage.removeItem('loginPopupLastShown')
    localStorage.removeItem('user')
    localStorage.removeItem('authToken')
    console.log('LoginPopup: State reset, popup will show on next page load')
  }

  // Function to simulate user login (for testing)
  const simulateLogin = () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Test User', email: 'test@example.com' }))
    localStorage.setItem('authToken', 'dummy-auth-token')
    setState(prev => ({ ...prev, isOpen: false }))
    console.log('LoginPopup: User logged in, popup closed')
  }

  return {
    isOpen: state.isOpen,
    shouldShow: state.shouldShow,
    openPopup,
    closePopup,
    showPopup,
    resetPopupState,
    simulateLogin,
    isUserLoggedIn: isUserLoggedIn(),
    wasShownRecently: wasShownRecently()
  }
}
