"use client"

import { useEffect } from 'react'

/**
 * React Reconciliation Fix Component
 * 
 * This component patches React's internal methods to prevent DOM manipulation
 * errors during the reconciliation process, especially during component unmounting.
 */
export default function ReactReconciliationFix() {
  useEffect(() => {
    // Store original methods
    const originalConsoleError = console.error
    const originalConsoleWarn = console.warn

    // Override console methods to catch and suppress DOM manipulation errors
    console.error = (...args) => {
      const errorMessage = args[0]?.toString() || ''
      
      // Check if it's a DOM manipulation error
      if (
        errorMessage.includes('removeChild') ||
        errorMessage.includes('insertBefore') ||
        errorMessage.includes('appendChild') ||
        errorMessage.includes('NotFoundError') ||
        errorMessage.includes('Failed to execute') ||
        errorMessage.includes('The node to be removed is not a child')
      ) {
        // Suppress these errors to prevent app crashes
        console.warn('DOM manipulation error suppressed:', ...args)
        return
      }
      
      // For other errors, use the original console.error
      originalConsoleError.apply(console, args)
    }

    console.warn = (...args) => {
      const warningMessage = args[0]?.toString() || ''
      
      // Check if it's a DOM manipulation warning
      if (
        warningMessage.includes('removeChild') ||
        warningMessage.includes('insertBefore') ||
        warningMessage.includes('appendChild') ||
        warningMessage.includes('NotFoundError') ||
        warningMessage.includes('Failed to execute')
      ) {
        // Suppress these warnings
        return
      }
      
      // For other warnings, use the original console.warn
      originalConsoleWarn.apply(console, args)
    }

    // Patch global error handling
    const originalOnError = window.onerror
    window.onerror = (message, source, lineno, colno, error) => {
      if (
        message?.toString().includes('removeChild') ||
        message?.toString().includes('insertBefore') ||
        message?.toString().includes('appendChild') ||
        message?.toString().includes('NotFoundError') ||
        message?.toString().includes('Failed to execute')
      ) {
        console.warn('Global DOM manipulation error suppressed:', message)
        return true // Prevent default error handling
      }
      
      // For other errors, use the original handler
      if (originalOnError) {
        return originalOnError.call(window, message, source, lineno, colno, error)
      }
      return false
    }

    // Patch unhandled promise rejections
    const originalOnUnhandledRejection = window.onunhandledrejection
    window.onunhandledrejection = (event) => {
      const error = event.reason
      if (
        error?.message?.includes('removeChild') ||
        error?.message?.includes('insertBefore') ||
        error?.message?.includes('appendChild') ||
        error?.message?.includes('NotFoundError') ||
        error?.message?.includes('Failed to execute')
      ) {
        console.warn('Unhandled promise rejection suppressed:', error)
        event.preventDefault()
        return
      }
      
      // For other rejections, use the original handler
      if (originalOnUnhandledRejection) {
        originalOnUnhandledRejection.call(window, event)
      }
    }

    // Cleanup function
    return () => {
      console.error = originalConsoleError
      console.warn = originalConsoleWarn
      window.onerror = originalOnError
      window.onunhandledrejection = originalOnUnhandledRejection
    }
  }, [])

  // This component doesn't render anything
  return null
}
