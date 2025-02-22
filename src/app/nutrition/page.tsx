/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@radix-ui/react-progress"
import { Clock, Flame, BeefIcon as Meat, CroissantIcon as Bread, DropletsIcon as Drop } from "lucide-react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { useEffect, useState } from "react"
ChartJS.register(ArcElement, Tooltip, Legend)

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const macroTargets = {
  calories: 2500,
  protein: 180,
  carbs: 250,
  fat: 80,
}

// Define types for the backend response
type NutritionalValues = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

type Meal = {
  _id: string
  type: string
  name: string
  description: string
  nutritionalValues: NutritionalValues
}

type DayData = {
  day: number
  meals: Meal[]
  status: string
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFats: number
  _id: string
}

export default function NutritionPage() {
  const [daysData, setDaysData] = useState<DayData[]>([]) // Store all days
  const [selectedDay, setSelectedDay] = useState<number>(1) // Track selected day
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meal/nutrition`)
        if (!response.ok) {
          throw new Error("Failed to fetch meal data")
        }
        const data = await response.json()
        setDaysData(data.mealPlan) // Set the days array from the response
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMealData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!daysData.length) return <div>No data found</div>

  // Find the selected day's data
  const dayData = daysData.find((day) => day.day === selectedDay)
  if (!dayData) return <div>No data found for the selected day</div>

  const totalCalories = dayData.totalCalories
  const totalProtein = dayData.totalProtein
  const totalCarbs = dayData.totalCarbs
  const totalFat = dayData.totalFats

  const chartData = {
    labels: ["Protein", "Carbs", "Fat"],
    datasets: [
      {
        data: [totalProtein * 4, totalCarbs * 4, totalFat * 9],
        backgroundColor: ["#818CF8", "#4ADE80", "#F59E0B"],
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: true,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      <main className="container py-8 px-4 max-w-7xl mx-auto">
        <motion.div initial="initial" animate="animate" variants={fadeIn} className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Daily Nutrition Overview</h1>
            <div className="text-sm text-gray-500">
              <Clock className="inline-block w-4 h-4 mr-1" />
              {new Date().toLocaleDateString("en-GB")}
            </div>
          </div>

          {/* Day Selection Buttons */}
          <div className="flex gap-4">
            {daysData.map((day) => (
              <button
                key={day.day}
                onClick={() => setSelectedDay(day.day)}
                className={`px-4 py-2 rounded-lg ${
                  selectedDay === day.day ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                Day {day.day}
              </button>
            ))}
          </div>

          {/* Nutrition Cards */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Flame className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Calories</span>
                  </div>
                  <span className="text-xs text-gray-400">Target: {macroTargets.calories}</span>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{totalCalories} kcal</div>
                  <Progress value={(totalCalories / macroTargets.calories) * 100} className="h-1.5" />
                </div>
              </CardContent>
            </Card>

            {/* Protein Card */}
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Meat className="w-5 h-5 text-indigo-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Protein</span>
                  </div>
                  <span className="text-xs text-gray-400">Target: {macroTargets.protein}g</span>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{totalProtein}g</div>
                  <Progress value={(totalProtein / macroTargets.protein) * 100} className="h-1.5" />
                </div>
              </CardContent>
            </Card>

            {/* Carbs Card */}
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Bread className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Carbs</span>
                  </div>
                  <span className="text-xs text-gray-400">Target: {macroTargets.carbs}g</span>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{totalCarbs}g</div>
                  <Progress value={(totalCarbs / macroTargets.carbs) * 100} className="h-1.5" />
                </div>
              </CardContent>
            </Card>

            {/* Fat Card */}
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Drop className="w-5 h-5 text-yellow-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Fat</span>
                  </div>
                  <span className="text-xs text-gray-400">Target: {macroTargets.fat}g</span>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{totalFat}g</div>
                  <Progress value={(totalFat / macroTargets.fat) * 100} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Meals and Macro Distribution */}
          <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              {dayData.meals.map((meal, index) => (
                <motion.div
                  key={meal._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-[1fr_2fr_1fr]">
                        <div className="relative aspect-square">
                          <Image src="/vercel.svg" alt={meal.name} fill className="object-cover" />
                        </div>
                        <div className="p-6 border-r">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-600">{meal.type}</span>
                            </div>
                            <h4 className="text-lg font-semibold">{meal.name}</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">{meal.description}</p>
                          </div>
                        </div>
                        <div className="p-6 bg-gray-50">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Calories</span>
                              <span className="font-semibold">{meal.nutritionalValues.calories} kcal</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Protein</span>
                              <span className="font-medium">{meal.nutritionalValues.protein}g</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Carbs</span>
                              <span className="font-medium">{meal.nutritionalValues.carbs}g</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Fat</span>
                              <span className="font-medium">{meal.nutritionalValues.fat}g</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Macro Distribution and Daily Goals */}
            <div className="space-y-6">
              <Card className="bg-white p-6">
                <h3 className="font-semibold mb-4">Macro Distribution</h3>
                <div className="relative aspect-square w-full max-w-[240px] mx-auto">
                  <Doughnut data={chartData} options={chartOptions} />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600">Protein</div>
                    <div className="text-lg font-semibold mt-1">
                      {Math.round(((totalProtein * 4) / totalCalories) * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600">Carbs</div>
                    <div className="text-lg font-semibold mt-1">
                      {Math.round(((totalCarbs * 4) / totalCalories) * 100)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600">Fat</div>
                    <div className="text-lg font-semibold mt-1">
                      {Math.round(((totalFat * 9) / totalCalories) * 100)}%
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white p-6">
                <h3 className="font-semibold mb-4">Daily Goals</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Calories</span>
                      <span className="text-gray-900">
                        {totalCalories} / {macroTargets.calories} kcal
                      </span>
                    </div>
                    <Progress value={(totalCalories / macroTargets.calories) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Protein</span>
                      <span className="text-gray-900">
                        {totalProtein} / {macroTargets.protein}g
                      </span>
                    </div>
                    <Progress value={(totalProtein / macroTargets.protein) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Carbs</span>
                      <span className="text-gray-900">
                        {totalCarbs} / {macroTargets.carbs}g
                      </span>
                    </div>
                    <Progress value={(totalCarbs / macroTargets.carbs) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Fat</span>
                      <span className="text-gray-900">
                        {totalFat} / {macroTargets.fat}g
                      </span>
                    </div>
                    <Progress value={(totalFat / macroTargets.fat) * 100} className="h-2" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}