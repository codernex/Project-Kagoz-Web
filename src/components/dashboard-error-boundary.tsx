"use client"

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class DashboardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a DOM manipulation error
    if (
      error.message.includes('removeChild') ||
      error.message.includes('insertBefore') ||
      error.message.includes('appendChild') ||
      error.message.includes('NotFoundError')
    ) {
      console.warn('DOM manipulation error caught by error boundary:', error)
      return { hasError: true, error }
    }
    
    // For other errors, let them bubble up
    return { hasError: false }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error but don't crash the app for DOM manipulation errors
    if (
      error.message.includes('removeChild') ||
      error.message.includes('insertBefore') ||
      error.message.includes('appendChild') ||
      error.message.includes('NotFoundError')
    ) {
      console.warn('DOM manipulation error handled by error boundary:', error, errorInfo)
      return
    }
    
    console.error('Error caught by error boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // For DOM manipulation errors, try to recover by re-rendering
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined })
      }, 100)
      
      return this.props.fallback || (
        <div className="min-h-screen bg-[#FCFCFD] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6F00FF] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default DashboardErrorBoundary
