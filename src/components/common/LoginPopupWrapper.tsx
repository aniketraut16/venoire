'use client'
import React from 'react'
import LoginPopUp from './LoginPopUp'
import { useLoginPopup } from '@/hooks/useLoginPopup'

export default function LoginPopupWrapper() {
  const { isOpen, closePopup, simulateLogin } = useLoginPopup()

  return (
    <LoginPopUp 
      isOpen={isOpen} 
      onClose={closePopup}
      onLogin={simulateLogin}
    />
  )
}
