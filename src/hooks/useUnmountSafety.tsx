"use client"

import { useEffect, useRef } from 'react'

/**
 * Hook to prevent state updates after component unmounting
 * This helps prevent DOM manipulation errors during React's reconciliation
 */
export function useUnmountSafety() {
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const safeSetState = <T>(setState: (value: T) => void, value: T) => {
    if (isMountedRef.current) {
      setState(value)
    }
  }

  const safeCallback = (callback: () => void) => {
    if (isMountedRef.current) {
      callback()
    }
  }

  return {
    isMounted: isMountedRef.current,
    safeSetState,
    safeCallback,
    isMountedRef
  }
}
