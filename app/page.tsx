'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newDark)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Skip to main content link */}
      <a href="#main" className="sr-only focus:not-sr-only">
        Skip to main content
      </a>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-card border border-border hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Light mode' : 'Dark mode'}
      >
        {isDark ? '🌞' : '🌙'}
      </button>

      {/* Decorative Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary/5 blur-3xl"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-accent/5 blur-3xl"
      />

      {/* Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl relative z-10"
        id="main"
        role="main"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-6"
        >
          <span className="text-8xl">🍽️</span>
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          CalorAI
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
          Discover your unique taste profile by swiping through delicious foods from around the world
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/swipe">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-full text-lg hover:shadow-2xl transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Start Swiping
            </motion.button>
          </Link>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-sm text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            Swipe left to pass, right to like
          </motion.div>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8 text-center">
          {[
            { label: 'Cuisines', value: '25+' },
            { label: 'Foods', value: '100s' },
            { label: 'Profile', value: 'Unique' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
