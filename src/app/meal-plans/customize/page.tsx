"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Utensils, Apple, Clock, Weight, Scale, Dumbbell, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface MealOption {
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
}

export default function CustomizeMealPlan() {
  const router = useRouter()
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null)
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([])
  const [allergies, setAllergies] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [height, setHeight] = useState<number | null>(null)
  const [weight, setWeight] = useState<number | null>(null)

  const handleMealSelection = (title: string) => {
    setSelectedMeal(title)
  }

  const handleGoalSelection = (goal: string) => {
    setSelectedGoal(goal)
  }

  const toggleDietaryRestriction = (diet: string) => {
    setDietaryRestrictions((prev) => (prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]))
  }

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = height / 100
      const bmi = weight / (heightInMeters * heightInMeters)
      return bmi.toFixed(1)
    }
    return "0.0"
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight"
    if (bmi < 25) return "Normal"
    if (bmi < 30) return "Overweight"
    return "Obese"
  }

  const submitHandler = async () => {
    const mealPreference = {
      goal: selectedGoal,
      mealCountPreference: selectedMeal,
      dietaryRestrictions,
      allergies,
      height,
      weight,
      bmi: calculateBMI(),
      bmiCategory: getBMICategory(Number(calculateBMI())),
    }
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meal`, {
        method: "POST",
        body: JSON.stringify({ mealPreference }),
      })

      if (response.status === 200) {
        setLoading(false)
        console.log("Meal preference saved successfully")
        router.push("/meal-dashboard")
      } else {
        console.error("Failed to save meal preference")
      }
    } catch (error) {
      console.error("Error saving meal preference:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <main className="container max-w-3xl py-6 min-w-full px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Customize Your Meal Plan</h1>
            <p className="text-muted-foreground">Step 2 of 5 • Meal Preferences</p>
            <div className="w-full bg-secondary h-2 mt-4 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "40%" }}
                transition={{ duration: 1 }}
                className="bg-primary h-full"
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              {/* BMI Section */}
              <div>
                <h2 className="font-semibold mb-4">Body Metrics</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="Enter your height"
                      value={height || ""}
                      onChange={(e) => setHeight(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Enter your weight"
                      value={weight || ""}
                      onChange={(e) => setWeight(Number(e.target.value))}
                    />
                  </div>
                </div>
                {height && weight && (
                  <div className="mt-4">
                    <p className="text-sm">
                      Your BMI: <span className="font-semibold">{calculateBMI()}</span>
                      {" - "}
                      <span
                        className={`text-muted-foreground px-2 py-1 rounded-full 
                          ${
                            getBMICategory(Number(calculateBMI())) === "Normal"
                              ? "bg-green-200/50 text-green-700"
                              : "bg-red-200/50 text-red-700"
                          }`}
                      >
                        {getBMICategory(Number(calculateBMI()))}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Dietary Restrictions */}
              <div>
                <h2 className="font-semibold mb-4">What are your dietary restrictions?</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {["Vegetarian", "Vegan", "Gluten-free", "Lactose-free", "Halal", "Jain", "Kosher", "None"].map(
                    (diet) => (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        key={diet}
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => toggleDietaryRestriction(diet)}
                      >
                        <Checkbox id={diet.toLowerCase()} checked={dietaryRestrictions.includes(diet)} />
                        <label htmlFor={diet.toLowerCase()}>{diet}</label>
                      </motion.div>
                    ),
                  )}
                </div>
              </div>

              {/* Goals */}
              <div>
                <h2 className="font-semibold mb-4">Choose Your Weight Goal</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { icon: Weight, title: "Weight Loss", subtitle: "Calorie Deficit" },
                    { icon: Scale, title: "Weight Stability", subtitle: "Balanced Intake" },
                    { icon: Dumbbell, title: "Weight Gain", subtitle: "Calorie Surplus" },
                  ].map((option: MealOption) => (
                    <Card
                      key={option.title}
                      className={`cursor-pointer transition-all duration-300 ease-in-out hover:bg-accent hover:shadow-lg ${
                        selectedGoal === option.title
                          ? "bg-gray-200/80 text-black scale-105 shadow-md"
                          : "bg-transparent"
                      }`}
                      onClick={() => handleGoalSelection(option.title)}
                    >
                      <CardContent className="flex flex-col items-center p-4">
                        <option.icon className="h-6 w-6 mb-2" />
                        <h3 className="font-medium">{option.title}</h3>
                        <p className="text-sm text-muted-foreground">{option.subtitle}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <h2 className="font-semibold mb-4">Do you have any allergies?</h2>
                <Textarea
                  placeholder="List any food allergies here..."
                  className="w-full"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                />
              </div>

              {/* Daily Meal Count */}
              <div>
                <h2 className="font-semibold mb-4">Daily Meal Count Preference</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { icon: Utensils, title: "3 Meals", subtitle: "Traditional" },
                    { icon: Apple, title: "5 Meals", subtitle: "With Snacks" },
                    { icon: Clock, title: "6+ Meals", subtitle: "Frequent Small" },
                  ].map((option: MealOption) => (
                    <Card
                      key={option.title}
                      className={`cursor-pointer transition-all duration-300 ease-in-out hover:bg-accent hover:shadow-lg ${
                        selectedMeal === option.title
                          ? "bg-gray-200/80 text-black scale-105 shadow-md"
                          : "bg-transparent"
                      }`}
                      onClick={() => handleMealSelection(option.title)}
                    >
                      <CardContent className="flex flex-col items-center p-4">
                        <option.icon className="h-6 w-6 mb-2" />
                        <h3 className="font-medium">{option.title}</h3>
                        <p className="text-sm text-muted-foreground">{option.subtitle}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Preferred Cuisine - Pro Feature */}
              <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-slate-50 to-white p-6">
                <div className="absolute -right-12 -top-12 h-40 w-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl" />
                <div className="absolute right-2 top-2">
                  <span className="relative inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary/90 to-secondary/90 px-3 py-1 text-sm font-semibold text-primary-foreground shadow-lg">
                    <span className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:200%_100%]" />
                    <Lock className="h-3 w-3" />
                    PRO
                  </span>
                </div>
                <h2 className="font-semibold mb-4">Choose your preferred cuisine</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      icon: Utensils,
                      title: "Asian",
                      subtitle: "Eastern Flavors",
                      image: "/padthai.jpg?height=80&width=80",
                    },
                    {
                      icon: Utensils,
                      title: "Mediterranean",
                      subtitle: "Healthy & Fresh",
                      image: "/acai.jpg?height=80&width=80",
                    },
                    {
                      icon: Utensils,
                      title: "Continental",
                      subtitle: "Western Cuisine",
                      image: "/alfredopasta5.jpg?height=80&width=80",
                    },
                  ].map((option: MealOption & { image: string }) => (
                    <Card
                      key={option.title}
                      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
                    >
                      <CardContent className="flex flex-col items-center p-4">
                        <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-full">
                          <Image
                            src={option.image || "/placeholder.svg"}
                            alt={option.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <h3 className="font-medium">{option.title}</h3>
                        <p className="text-sm text-muted-foreground">{option.subtitle}</p>
                      </CardContent>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px]">
                        <Lock className="h-6 w-6 text-primary/70" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Available Ingredients - Pro Feature */}
              <div className="relative overflow-hidden rounded-lg border bg-gradient-to-br from-slate-50 to-white p-6">
                <div className="absolute -left-12 -top-12 h-40 w-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl" />
                <div className="absolute right-2 top-2">
                  <span className="relative inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary/90 to-secondary/90 px-3 py-1 text-sm font-semibold text-primary-foreground shadow-lg">
                    <span className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:200%_100%]" />
                    <Lock className="h-3 w-3" />
                    PRO
                  </span>
                </div>
                <h2 className="font-semibold mb-4">Available ingredients</h2>
                <div className="relative">
                  <Textarea
                    placeholder="Unlock premium feature to list and track your available ingredients..."
                    className="w-full bg-white/50 backdrop-blur-[1px]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px]">
                    <Button variant="outline" className="border-primary/20 bg-white/80">
                      <Lock className="mr-2 h-4 w-4 text-primary/70" />
                      Unlock Premium Feature
                    </Button>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <motion.div
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                className="min-w-full flex justify-center"
              >
                <Button
                  onClick={submitHandler}
                  className="bg-gradient-to-r from-primary to-secondary text-black font-semibold py-3 rounded-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:brightness-110"
                >
                  {loading ? "Loading ...." : "Continue to Dashboard →"}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

