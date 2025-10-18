'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SmoothScrollContextType {
  isEnabled: boolean
  enableSmoothScroll: () => void
  disableSmoothScroll: () => void
}

const SmoothScrollContext = createContext<SmoothScrollContextType | undefined>(undefined)

export const useSmoothScroll = () => {
  const context = useContext(SmoothScrollContext)
  if (context === undefined) {
    throw new Error('useSmoothScroll must be used within a SmoothScrollProvider')
  }
  return context
}

interface SmoothScrollProviderProps {
  children: ReactNode
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false)

  const enableSmoothScroll = () => {
    setIsEnabled(true)
  }

  const disableSmoothScroll = () => {
    setIsEnabled(false)
  }

  const value = {
    isEnabled,
    enableSmoothScroll,
    disableSmoothScroll,
  }

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  )
}
