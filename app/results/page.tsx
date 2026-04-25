'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSwipeStore, FoodItem } from '@/lib/store'

export default function ResultsPage() {
  const { liked, disliked } = useSwipeStore()

  const stats = useMemo(() => {
    // Deduplicate liked and disliked items
    const uniqueLiked = liked.reduce((acc, item) => {
      if (!acc.some(i => i.id === item.id)) acc.push(item)
      return acc
    }, [] as FoodItem[])

    const uniqueDisliked = disliked.reduce((acc, item) => {
      if (!acc.some(i => i.id === item.id)) acc.push(item)
      return acc
    }, [] as FoodItem[])

    const totalVotes = uniqueLiked.length + uniqueDisliked.length
    const likePercentage = totalVotes > 0 ? (uniqueLiked.length / totalVotes) * 100 : 0

    const categoryLikes = uniqueLiked.reduce(
      (acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const topCategories = Object.entries(categoryLikes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    return {
      totalVotes,
      likePercentage,
      topCategories,
      uniqueLiked,
      uniqueDisliked,
    }
  }, [liked, disliked])

  if (liked.length === 0 && disliked.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🤔</div>
          <h1 className="text-4xl font-bold mb-2">No Data Yet</h1>
          <p className="text-muted-foreground mb-8">Start swiping to see your taste profile!</p>
          <Link href="/swipe">
            <button className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-full hover:shadow-2xl transition-shadow">
              Start Swiping
            </button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background px-4 py-12">
      {/* Skip to main content */}
      <a href="#results-main" className="sr-only focus:not-sr-only">
        Skip to results
      </a>

      {/* Header */}
      <div className="absolute top-6 left-6">
        <Link href="/swipe">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-full bg-card border border-border hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Go back to swiping"
            title="Back"
          >
            ←
          </motion.button>
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
        id="results-main"
        role="main"
      >
        {/* Title */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Your Taste Profile</h1>
          <p className="text-xl text-muted-foreground">
            Based on {stats.totalVotes} food choices
          </p>
        </motion.div>

        {/* Main Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-card rounded-2xl p-8 border border-border backdrop-blur-sm">
            <div className="text-5xl font-bold text-primary mb-2">
              {stats.likePercentage.toFixed(0)}%
            </div>
            <p className="text-muted-foreground">Foods You&apos;d Like</p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border backdrop-blur-sm">
            <div className="text-5xl font-bold text-green-500 mb-2">
              {liked.length}
            </div>
            <p className="text-muted-foreground">Liked Foods</p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border backdrop-blur-sm">
            <div className="text-5xl font-bold text-red-500 mb-2">
              {disliked.length}
            </div>
            <p className="text-muted-foreground">Passed Foods</p>
          </div>
        </motion.div>

        {/* Top Categories */}
        {stats.topCategories.length > 0 && (
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Your Favorite Cuisines</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.topCategories.map(([category, count], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20 backdrop-blur-sm"
                >
                  <div className="text-3xl font-bold text-primary mb-2">{count}</div>
                  <p className="text-lg font-medium text-foreground">{category}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {((count / stats.uniqueLiked.length) * 100).toFixed(0)}% of your likes
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Liked Foods */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Foods You Liked</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.uniqueLiked.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-2xl p-6 border border-border backdrop-blur-sm flex flex-col items-center justify-center gap-3 hover:bg-secondary transition-colors"
              >
                <span className="text-4xl">{item.emoji}</span>
                <span className="font-medium text-center text-sm">{item.name}</span>
                <span className="text-xs text-muted-foreground">{item.category}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Disliked Foods */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Foods You Passed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.uniqueDisliked.slice(0, 8).map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-2xl p-6 border border-border backdrop-blur-sm flex flex-col items-center justify-center gap-3 hover:bg-secondary transition-colors opacity-60"
              >
                <span className="text-4xl">{item.emoji}</span>
                <span className="font-medium text-center text-sm">{item.name}</span>
                <span className="text-xs text-muted-foreground">{item.category}</span>
              </motion.div>
            ))}
          </div>
          {stats.uniqueDisliked.length > 8 && (
            <p className="text-center text-muted-foreground mt-4">
              +{stats.uniqueDisliked.length - 8} more foods passed
            </p>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="flex gap-4 justify-center">
          <Link href="/swipe">
            <button className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-full hover:shadow-2xl transition-shadow">
              Swipe More
            </button>
          </Link>
          <Link href="/">
            <button className="px-8 py-4 bg-card border border-border font-semibold rounded-full hover:bg-secondary transition-colors">
              Home
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
