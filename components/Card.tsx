'use client'

import { motion } from 'framer-motion'
import { FoodItem } from '@/lib/store'

interface CardProps {
  item: FoodItem
  isDragging?: boolean
  dragX?: number
  opacity?: number
  rotate?: number
}

export function Card({ item, isDragging = false, dragX = 0, opacity = 1, rotate = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        x: dragX,
        rotate,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      className="absolute w-80 h-96 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm border border-primary/20 shadow-2xl flex flex-col items-center justify-center gap-6 pointer-events-none transition-shadow"
      role="img"
      aria-label={`${item.name} - ${item.category} cuisine`}
    >
      <div className="text-9xl drop-shadow-lg select-none">{item.emoji}</div>
      <div className="text-center">
        <h3 className="text-3xl font-bold text-foreground mb-2">{item.name}</h3>
        <p className="text-sm text-muted-foreground uppercase tracking-wider">{item.category}</p>
      </div>
    </motion.div>
  )
}
