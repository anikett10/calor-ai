'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Card } from '@/components/Card'
import { useSwipeStore, FoodItem } from '@/lib/store'
import { FOOD_ITEMS, getRandomFoods } from '@/lib/foods'
import { useSwipeDetect } from '@/hooks/useSwipeDetect'

export default function SwipePage() {
  const [items, setItems] = useState<FoodItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef<number>(0)

  const { liked, disliked, addLiked, addDisliked, undo, history } = useSwipeStore()

  useEffect(() => {
    setItems(getRandomFoods(25))
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handleSwipeLeft()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleSwipeRight()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, items])

  const currentItem = items[currentIndex]
  const seenIds = new Set(history.map((item) => item.id))

  const handleSwipeRight = () => {
    if (currentItem) {
      addLiked(currentItem)
      moveToNext()
    }
  }

  const handleSwipeLeft = () => {
    if (currentItem) {
      addDisliked(currentItem)
      moveToNext()
    }
  }

  const moveToNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setDragX(0)
    } else {
      // Load more items when reaching the end (only if more are available)
      const newItems = getRandomFoods(10, Array.from(seenIds))
      if (newItems.length > 0) {
        setItems([...items, ...newItems])
      }
    }
  }

  const handleUndo = () => {
    if (history.length > 0) {
      undo()
      setCurrentIndex(Math.max(0, currentIndex - 1))
      setDragX(0)
    }
  }

  const swipeHandlers = useSwipeDetect({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
  })

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    dragStartX.current = clientX
  }

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    setDragX(clientX - dragStartX.current)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (dragX > 50) {
      handleSwipeRight()
    } else if (dragX < -50) {
      handleSwipeLeft()
    } else {
      setDragX(0)
    }
  }

  if (!currentItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold mb-2">Profile Complete!</h1>
          <p className="text-muted-foreground mb-8">Let&apos;s see your taste profile</p>
          <Link href="/results">
            <button className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-full hover:shadow-2xl transition-shadow">
              View Results
            </button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const rotation = dragX / 30
  const opacity = Math.max(0, 1 - Math.abs(dragX) / 200)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background flex flex-col items-center justify-center px-4 py-8 relative">
      {/* Skip to main content */}
      <a href="#swipe-main" className="sr-only focus:not-sr-only">
        Skip to swiping interface
      </a>

      {/* Header */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-full bg-card border border-border hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Go back to home"
            title="Home"
          >
            ←
          </motion.button>
        </Link>

        <div className="text-center" role="status" aria-live="polite" aria-atomic="true">
          <h2 className="text-lg font-semibold">Progress</h2>
          <p className="text-sm text-muted-foreground">{currentIndex + 1} / {items.length}</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleUndo}
          disabled={history.length === 0}
          className="p-3 rounded-full bg-card border border-border hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Undo last swipe"
          title="Undo"
        >
          ↻
        </motion.button>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(currentIndex / items.length) * 100}%` }}
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary to-accent"
      />

      {/* Card Container */}
      <div
        className="relative w-80 h-96 cursor-grab active:cursor-grabbing select-none"
        id="swipe-main"
        role="main"
        onMouseDown={handleDragStart}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={swipeHandlers.handleTouchStart}
        onTouchMove={(e) => {
          const clientX = e.touches[0].clientX
          setDragX(clientX - dragStartX.current)
        }}
        onTouchEnd={swipeHandlers.handleTouchEnd}
        aria-label={`Swipe interface showing ${currentItem?.name || 'food'}`}
      >
        <AnimatePresence mode="wait">
          <Card
            key={currentItem.id}
            item={currentItem}
            isDragging={isDragging}
            dragX={dragX}
            opacity={opacity}
            rotate={rotation}
          />
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-8 mt-16 relative z-10" role="group" aria-label="Food choice buttons">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSwipeLeft}
          className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 text-2xl hover:bg-red-500/30 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Not interested - pass on this food"
          title="Pass (swipe left or press ←)"
        >
          ✕
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSwipeRight}
          className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 text-2xl hover:bg-green-500/30 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Interested - like this food"
          title="Like (swipe right or press →)"
        >
          ♥
        </motion.button>
      </div>

      {/* Swipe Indicators */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between text-sm text-muted-foreground pointer-events-none">
        <motion.span
          animate={{ opacity: dragX < -20 ? 1 : 0.3 }}
          transition={{ duration: 0.1 }}
        >
          Not interested
        </motion.span>
        <motion.span
          animate={{ opacity: dragX > 20 ? 1 : 0.3 }}
          transition={{ duration: 0.1 }}
        >
          Interested
        </motion.span>
      </div>
    </div>
  )
}
