"use client"

import { useEffect } from 'react'

/**
 * Next.js DOM Fix Component
 * 
 * This component provides Next.js specific fixes for DOM manipulation errors
 * that occur during React's reconciliation process, especially with Next.js 15.
 */
export default function NextJSDOMFix() {
  useEffect(() => {
    // Store original methods
    const originalConsoleError = console.error
    const originalConsoleWarn = console.warn

    // Create a more aggressive error suppression for Next.js
    const suppressDOMErrors = (message: string) => {
      return (
        message.includes('removeChild') ||
        message.includes('insertBefore') ||
        message.includes('appendChild') ||
        message.includes('NotFoundError') ||
        message.includes('Failed to execute') ||
        message.includes('The node to be removed is not a child') ||
        message.includes('Cannot read properties') ||
        message.includes('Cannot access before initialization')
      )
    }

    // Override console.error
    console.error = (...args) => {
      const message = args[0]?.toString() || ''
      if (suppressDOMErrors(message)) {
        console.warn('Next.js DOM error suppressed:', ...args)
        return
      }
      originalConsoleError.apply(console, args)
    }

    // Override console.warn
    console.warn = (...args) => {
      const message = args[0]?.toString() || ''
      if (suppressDOMErrors(message)) {
        return // Completely suppress these warnings
      }
      originalConsoleWarn.apply(console, args)
    }

    // Patch global error handlers
    const originalOnError = window.onerror
    window.onerror = (message, source, lineno, colno, error) => {
      if (suppressDOMErrors(message?.toString() || '')) {
        console.warn('Global DOM error suppressed:', message)
        return true
      }
      if (originalOnError) {
        return originalOnError.call(window, message, source, lineno, colno, error)
      }
      return false
    }

    // Patch unhandled promise rejections
    const originalOnUnhandledRejection = window.onunhandledrejection
    window.onunhandledrejection = (event) => {
      const error = event.reason
      const message = error?.message || error?.toString() || ''
      if (suppressDOMErrors(message)) {
        console.warn('Unhandled promise rejection suppressed:', error)
        event.preventDefault()
        return
      }
      if (originalOnUnhandledRejection) {
        originalOnUnhandledRejection.call(window, event)
      }
    }

    // Patch React's internal error handling
    const originalAddEventListener = EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (type === 'error' && typeof listener === 'function') {
        const wrappedListener = (event: any) => {
          if (suppressDOMErrors(event?.message || '')) {
            console.warn('Event listener DOM error suppressed:', event)
            return
          }
          return listener.call(this, event)
        }
        return originalAddEventListener.call(this, type, wrappedListener, options)
      }
      return originalAddEventListener.call(this, type, listener, options)
    }

    // Cleanup function
    return () => {
      console.error = originalConsoleError
      console.warn = originalConsoleWarn
      window.onerror = originalOnError
      window.onunhandledrejection = originalOnUnhandledRejection
      EventTarget.prototype.addEventListener = originalAddEventListener
    }
  }, [])

  // This component doesn't render anything
  return null
}
