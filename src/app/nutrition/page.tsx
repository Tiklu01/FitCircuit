"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const meals = [
  {
    id: 1,
    title: "Morning",
    time: "8:00 AM",
    meal: "Oatmeal with Fruits",
    description:
      "A hearty bowl of steel-cut oats topped with fresh berries, banana slices, and a drizzle of honey. Rich in fiber and antioxidants.",
    calories: 320,
    macros: {
      protein: "12g",
      carbs: "45g",
      fat: "8g",
    },
  },
  {
    id: 2,
    title: "Pre-Workout",
    time: "10:30 AM",
    meal: "Banana & Protein Shake",
    description:
      "A power-packed shake with whey protein, banana, almond milk, and a touch of cinnamon. Perfect pre-workout fuel.",
    calories: 280,
    macros: {
      protein: "24g",
      carbs: "30g",
      fat: "5g",
    },
  },
  {
    id: 3,
    title: "Post-Workout",
    time: "1:00 PM",
    meal: "Chicken & Sweet Potato",
    description:
      "Grilled chicken breast with roasted sweet potato wedges and steamed broccoli. High protein, post-workout recovery meal.",
    calories: 450,
    macros: {
      protein: "35g",
      carbs: "55g",
      fat: "12g",
    },
  },
  {
    id: 4,
    title: "Afternoon",
    time: "4:00 PM",
    meal: "Greek Yogurt & Nuts",
    description:
      "Protein-rich Greek yogurt topped with mixed nuts, honey, and chia seeds. A balanced afternoon snack rich in healthy fats.",
    calories: 300,
    macros: {
      protein: "20g",
      carbs: "15g",
      fat: "22g",
    },
  },
  {
    id: 5,
    title: "Evening",
    time: "6:00 PM",
    meal: "Protein Bar",
    description:
      "All-natural protein bar made with dates, nuts, and whey protein. Quick energy boost before evening activities.",
    calories: 220,
    macros: {
      protein: "20g",
      carbs: "25g",
      fat: "8g",
    },
  },
  {
    id: 6,
    title: "Dinner",
    time: "8:00 PM",
    meal: "Salmon & Quinoa",
    description:
      "Pan-seared Atlantic salmon with quinoa pilaf and roasted vegetables. Rich in omega-3 fatty acids and complete proteins.",
    calories: 520,
    macros: {
      protein: "45g",
      carbs: "45g",
      fat: "22g",
    },
  },
]

export default function NutritionPage() {
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0)
  const totalProtein = meals.reduce((sum, meal) => sum + Number.parseInt(meal.macros.protein), 0)
  const totalCarbs = meals.reduce((sum, meal) => sum + Number.parseInt(meal.macros.carbs), 0)
  const totalFat = meals.reduce((sum, meal) => sum + Number.parseInt(meal.macros.fat), 0)

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <main className="container py-6">
        <motion.div initial="initial" animate="animate" variants={fadeIn} className="space-y-6">
          <h1 className="text-2xl font-bold tracking-tight">Daily Nutrition Overview</h1>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Calories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCalories} kcal</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Protein</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProtein}g</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carbs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCarbs}g</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFat}g</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {meals.map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="grid md:grid-cols-[1fr_2fr_1fr] gap-4 p-6">
                    <div className="relative aspect-square rounded-md overflow-hidden">
                      <Image src="/placeholder.svg" alt={meal.meal} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-sm text-muted-foreground">{meal.title}</h3>
                        <p className="text-sm text-muted-foreground">{meal.time}</p>
                        <h4 className="font-semibold">{meal.meal}</h4>
                        <p className="text-sm text-muted-foreground">{meal.description}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="font-semibold">{meal.calories} kcal</div>
                      <div className="text-sm text-muted-foreground">Protein: {meal.macros.protein}</div>
                      <div className="text-sm text-muted-foreground">Carbs: {meal.macros.carbs}</div>
                      <div className="text-sm text-muted-foreground">Fat: {meal.macros.fat}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}

