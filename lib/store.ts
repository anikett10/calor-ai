import { create } from 'zustand'

export interface FoodItem {
  id: string
  name: string
  category: string
  emoji: string
}

interface SwipeState {
  liked: FoodItem[]
  disliked: FoodItem[]
  history: FoodItem[]
  addLiked: (item: FoodItem) => void
  addDisliked: (item: FoodItem) => void
  addToHistory: (item: FoodItem) => void
  undo: () => void
  reset: () => void
}

export const useSwipeStore = create<SwipeState>((set) => ({
  liked: [],
  disliked: [],
  history: [],
  addLiked: (item: FoodItem) =>
    set((state) => ({
      liked: [...state.liked, item],
      history: [...state.history, item],
    })),
  addDisliked: (item: FoodItem) =>
    set((state) => ({
      disliked: [...state.disliked, item],
      history: [...state.history, item],
    })),
  addToHistory: (item: FoodItem) =>
    set((state) => ({
      history: [...state.history, item],
    })),
  undo: () =>
    set((state) => {
      if (state.history.length === 0) return state
      const lastItem = state.history[state.history.length - 1]
      const newHistory = state.history.slice(0, -1)
      return {
        history: newHistory,
        liked: state.liked.filter((item) => item.id !== lastItem.id),
        disliked: state.disliked.filter((item) => item.id !== lastItem.id),
      }
    }),
  reset: () => ({
    liked: [],
    disliked: [],
    history: [],
  }),
}))
