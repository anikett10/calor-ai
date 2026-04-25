import { useRef, useCallback, useEffect } from 'react'

interface SwipeHandlers {
  onSwipeLeft: () => void
  onSwipeRight: () => void
}

const SWIPE_THRESHOLD = 50

export const useSwipeDetect = ({ onSwipeLeft, onSwipeRight }: SwipeHandlers) => {
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY

      const deltaX = touchEndX - touchStartX.current
      const deltaY = touchEndY - touchStartY.current

      // Only detect horizontal swipes, ignore vertical movement
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
          if (deltaX > 0) {
            onSwipeRight()
          } else {
            onSwipeLeft()
          }
        }
      }
    },
    [onSwipeLeft, onSwipeRight]
  )

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    touchStartX.current = e.clientX
    touchStartY.current = e.clientY
  }, [])

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      const touchEndX = e.clientX
      const touchEndY = e.clientY

      const deltaX = touchEndX - touchStartX.current
      const deltaY = touchEndY - touchStartY.current

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
          if (deltaX > 0) {
            onSwipeRight()
          } else {
            onSwipeLeft()
          }
        }
      }
    },
    [onSwipeLeft, onSwipeRight]
  )

  // Keyboard support for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onSwipeLeft()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onSwipeRight()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSwipeLeft, onSwipeRight])

  return {
    handleTouchStart,
    handleTouchEnd,
    handleMouseDown,
    handleMouseUp,
  }
}
