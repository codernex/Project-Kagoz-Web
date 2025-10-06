"use client"

import { useEffect } from 'react'

/**
 * Global Error Handler Component
 * 
 * This component provides global error handling for the application,
 * specifically targeting DOM manipulation errors and navigation issues.
 */
export default function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason
      
      // Check if it's a DOM manipulation error
      if (
        error?.message?.includes('removeChild') ||
        error?.message?.includes('insertBefore') ||
        error?.message?.includes('appendChild') ||
        error?.message?.includes('NotFoundError')
      ) {
        console.warn('DOM manipulation error caught in promise rejection:', error)
        event.preventDefault() // Prevent the error from crashing the app
        return
      }
      
      // For other errors, let them be handled normally
      console.error('Unhandled promise rejection:', error)
    }

    // Handle global errors
    const handleError = (event: ErrorEvent) => {
      const error = event.error
      
      // Check if it's a DOM manipulation error
      if (
        error?.message?.includes('removeChild') ||
        error?.message?.includes('insertBefore') ||
        error?.message?.includes('appendChild') ||
        error?.message?.includes('NotFoundError')
      ) {
        console.warn('DOM manipulation error caught globally:', error)
        event.preventDefault() // Prevent the error from crashing the app
        return
      }
      
      // For other errors, let them be handled normally
      console.error('Global error:', error)
    }

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    // Cleanup function
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  // This component doesn't render anything
  return null
}
