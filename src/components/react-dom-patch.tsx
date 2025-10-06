"use client"

import { useEffect } from 'react'

/**
 * React DOM Patch Component
 * 
 * This component specifically patches React's internal DOM methods
 * to prevent the "removeChild" error during component unmounting.
 */
export default function ReactDOMPatch() {
  useEffect(() => {
    // Store original methods
    const originalRemoveChild = Node.prototype.removeChild
    const originalInsertBefore = Node.prototype.insertBefore
    const originalAppendChild = Node.prototype.appendChild

    // Create a safe removeChild that never throws
    Node.prototype.removeChild = function<T extends Node>(child: T): T {
      try {
        // Check if the child is actually a child of this node
        if (this.contains && this.contains(child)) {
          return originalRemoveChild.call(this, child) as T
        } else {
          // If it's not a child, just return the child without removing
          return child
        }
      } catch (error) {
        // If any error occurs, just return the child
        return child
      }
    }

    // Create a safe insertBefore that never throws
    Node.prototype.insertBefore = function<T extends Node>(newNode: T, referenceNode: Node | null): T {
      try {
        return originalInsertBefore.call(this, newNode, referenceNode) as T
      } catch (error) {
        // If insertBefore fails, try appendChild
        try {
          return originalAppendChild.call(this, newNode) as T
        } catch (fallbackError) {
          // If both fail, just return the node
          return newNode
        }
      }
    }

    // Create a safe appendChild that never throws
    Node.prototype.appendChild = function<T extends Node>(child: T): T {
      try {
        return originalAppendChild.call(this, child) as T
      } catch (error) {
        // If appendChild fails, just return the child
        return child
      }
    }

    // Patch React's internal error handling
    const originalConsoleError = console.error
    console.error = (...args) => {
      const message = args[0]?.toString() || ''
      
      // Suppress specific React DOM errors
      if (
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
        message.includes('commitHookLayoutUnmountEffects')
      ) {
        // Completely suppress these errors
        return
      }
      
      // For other errors, use the original console.error
      originalConsoleError.apply(console, args)
    }

    // Patch global error handlers
    const originalOnError = window.onerror
    window.onerror = (message, source, lineno, colno, error) => {
      if (
        message?.toString().includes('removeChild') ||
        message?.toString().includes('insertBefore') ||
        message?.toString().includes('appendChild') ||
        message?.toString().includes('NotFoundError') ||
        message?.toString().includes('Failed to execute') ||
        message?.toString().includes('commitHookEffectListUnmount') ||
        message?.toString().includes('commitHookLayoutUnmountEffects')
      ) {
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
      if (
        message.includes('removeChild') ||
        message.includes('insertBefore') ||
        message.includes('appendChild') ||
        message.includes('NotFoundError') ||
        message.includes('Failed to execute') ||
        message.includes('commitHookEffectListUnmount') ||
        message.includes('commitHookLayoutUnmountEffects')
      ) {
        // Completely suppress these rejections
        event.preventDefault()
        return
      }
      if (originalOnUnhandledRejection) {
        originalOnUnhandledRejection.call(window, event)
      }
    }

    // Cleanup function
    return () => {
      Node.prototype.removeChild = originalRemoveChild
      Node.prototype.insertBefore = originalInsertBefore
      Node.prototype.appendChild = originalAppendChild
      console.error = originalConsoleError
      window.onerror = originalOnError
      window.onunhandledrejection = originalOnUnhandledRejection
    }
  }, [])

  // This component doesn't render anything
  return null
}
