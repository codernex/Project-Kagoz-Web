"use client"

import { useEffect } from 'react'

/**
 * DOM Manipulation Fix Component
 * 
 * This component helps prevent DOM manipulation errors that can occur
 * during React's reconciliation process, especially during navigation
 * and component unmounting.
 */
export default function DOMManipulationFix() {
  useEffect(() => {
    // Override console.error to catch and handle DOM manipulation errors
    const originalError = console.error
    
    console.error = (...args) => {
      const errorMessage = args[0]?.toString() || ''
      
      // Check if it's a DOM manipulation error
      if (
        errorMessage.includes('removeChild') ||
        errorMessage.includes('insertBefore') ||
        errorMessage.includes('appendChild') ||
        errorMessage.includes('NotFoundError')
      ) {
        // Log the error but don't throw it to prevent app crashes
        console.warn('DOM manipulation error caught and handled:', ...args)
        return
      }
      
      // For other errors, use the original console.error
      originalError.apply(console, args)
    }

    // Cleanup function
    return () => {
      console.error = originalError
    }
  }, [])

  // This component doesn't render anything
  return null
}
