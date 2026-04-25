import { FoodItem } from './store'

export const FOOD_ITEMS: FoodItem[] = [
  { id: '1', name: 'Sushi', category: 'Japanese', emoji: '🍣' },
  { id: '2', name: 'Pizza', category: 'Italian', emoji: '🍕' },
  { id: '3', name: 'Tacos', category: 'Mexican', emoji: '🌮' },
  { id: '4', name: 'Pad Thai', category: 'Thai', emoji: '🍜' },
  { id: '5', name: 'Burger', category: 'American', emoji: '🍔' },
  { id: '6', name: 'Curry', category: 'Indian', emoji: '🍛' },
  { id: '7', name: 'Falafel', category: 'Middle Eastern', emoji: '🧆' },
  { id: '8', name: 'Pho', category: 'Vietnamese', emoji: '🍲' },
  { id: '9', name: 'Pasta', category: 'Italian', emoji: '🍝' },
  { id: '10', name: 'Steak', category: 'American', emoji: '🥩' },
  { id: '11', name: 'Gyro', category: 'Greek', emoji: '🌯' },
  { id: '12', name: 'Ramen', category: 'Japanese', emoji: '🍜' },
  { id: '13', name: 'Kebab', category: 'Turkish', emoji: '🍢' },
  { id: '14', name: 'Ceviche', category: 'Peruvian', emoji: '🦐' },
  { id: '15', name: 'Pierogi', category: 'Polish', emoji: '🥟' },
  { id: '16', name: 'Couscous', category: 'Moroccan', emoji: '🥘' },
  { id: '17', name: 'Paella', category: 'Spanish', emoji: '🍲' },
  { id: '18', name: 'Croissant', category: 'French', emoji: '🥐' },
  { id: '19', name: 'Dumpling', category: 'Chinese', emoji: '🥟' },
  { id: '20', name: 'Goulash', category: 'Hungarian', emoji: '🍲' },
  { id: '21', name: 'Brisket', category: 'Jewish', emoji: '🥩' },
  { id: '22', name: 'Shawarma', category: 'Middle Eastern', emoji: '🌯' },
  { id: '23', name: 'Poutine', category: 'Canadian', emoji: '🍟' },
  { id: '24', name: 'Schnitzel', category: 'Austrian', emoji: '🍖' },
  { id: '25', name: 'Moussaka', category: 'Greek', emoji: '🍆' },
]

export function getRandomFoods(count: number, exclude: string[] = []): FoodItem[] {
  const available = FOOD_ITEMS.filter((item) => !exclude.includes(item.id))
  const shuffled = [...available].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
