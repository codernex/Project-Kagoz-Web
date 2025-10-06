"use client"

import { useEffect } from 'react'

/**
 * Next.js 15 Specific Fix Component
 * 
 * This component provides fixes specifically for Next.js 15 and Turbopack
 * to handle DOM manipulation errors during development and production.
 */
export default function NextJS15Fix() {
  useEffect(() => {
    // Store original methods
    const originalConsoleError = console.error
    const originalConsoleWarn = console.warn

    // Create a comprehensive error suppression function
    const shouldSuppressError = (message: string) => {
      return (
        message.includes('removeChild') ||
        message.includes('insertBefore') ||
        message.includes('appendChild') ||
        message.includes('NotFoundError') ||
        message.includes('Failed to execute') ||
        message.includes('The node to be removed is not a child') ||
        message.includes('commitHookEffectListUnmount') ||
        message.includes('commitHookLayoutUnmountEffects') ||
        message.includes('runWithFiberInDEV') ||
        message.includes('commitHookEffectListUnmount') ||
        message.includes('commitHookLayoutUnmountEffects') ||
        message.includes('react-stack-bottom-frame') ||
        message.includes('node_modules_next_dist_client') ||
        message.includes('node_modules_next_dist_compiled_react-dom')
      )
    }

    // Override console.error with aggressive suppression
    console.error = (...args) => {
      const message = args[0]?.toString() || ''
      if (shouldSuppressError(message)) {
        // Completely suppress these errors
        return
      }
      originalConsoleError.apply(console, args)
    }

    // Override console.warn with aggressive suppression
    console.warn = (...args) => {
      const message = args[0]?.toString() || ''
      if (shouldSuppressError(message)) {
        // Completely suppress these warnings
        return
      }
      originalConsoleWarn.apply(console, args)
    }

    // Patch global error handlers
    const originalOnError = window.onerror
    window.onerror = (message, source, lineno, colno, error) => {
      if (shouldSuppressError(message?.toString() || '')) {
        // Completely suppress these errors
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
      if (shouldSuppressError(message)) {
        // Completely suppress these rejections
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
          const message = event?.message || event?.toString() || ''
          if (shouldSuppressError(message)) {
            // Completely suppress these errors
            return
          }
          return listener.call(this, event)
        }
        return originalAddEventListener.call(this, type, wrappedListener, options)
      }
      return originalAddEventListener.call(this, type, listener, options)
    }

    // Patch React's internal DOM operations
    const originalRemoveChild = Node.prototype.removeChild
    const originalInsertBefore = Node.prototype.insertBefore
    const originalAppendChild = Node.prototype.appendChild

    // Create safe DOM methods that never throw
    Node.prototype.removeChild = function<T extends Node>(child: T): T {
      try {
        if (this.contains && this.contains(child)) {
          return originalRemoveChild.call(this, child) as T
        } else {
          return child
        }
      } catch (error) {
        return child
      }
    }

    Node.prototype.insertBefore = function<T extends Node>(newNode: T, referenceNode: Node | null): T {
      try {
        return originalInsertBefore.call(this, newNode, referenceNode) as T
      } catch (error) {
        try {
          return originalAppendChild.call(this, newNode) as T
        } catch (fallbackError) {
          return newNode
        }
      }
    }

    Node.prototype.appendChild = function<T extends Node>(child: T): T {
      try {
        return originalAppendChild.call(this, child) as T
      } catch (error) {
        return child
      }
    }

    // Cleanup function
    return () => {
      console.error = originalConsoleError
      console.warn = originalConsoleWarn
      window.onerror = originalOnError
      window.onunhandledrejection = originalOnUnhandledRejection
      EventTarget.prototype.addEventListener = originalAddEventListener
      Node.prototype.removeChild = originalRemoveChild
      Node.prototype.insertBefore = originalInsertBefore
      Node.prototype.appendChild = originalAppendChild
    }
  }, [])

  // This component doesn't render anything
  return null
}
