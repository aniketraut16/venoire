'use client'
import React from 'react'
import LoginPopUp from './LoginPopUp'
import { useLoginPopup } from '@/hooks/useLoginPopup'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPopupWrapper() {
  const { isOpen, closePopup, simulateLogin } = useLoginPopup()
  const { user } = useAuth()

  if (user) {
    return null
  }

  return (
    <LoginPopUp 
      isOpen={isOpen} 
      onClose={closePopup}
      onLogin={simulateLogin}
    />
  )
}
