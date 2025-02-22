"use client"

import { motion } from "framer-motion"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Utensils, Apple, Clock } from "lucide-react"

export default function CustomizeMealPlan() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <main className="container max-w-3xl py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Customize Your Meal Plan</h1>
            <p className="text-muted-foreground">Step 2 of 5 • Meal Preferences</p>
            <div className="w-full bg-secondary h-2 mt-4 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-2/5" />
            </div>
          </div>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="font-semibold mb-4">What are your dietary restrictions?</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {["Vegetarian", "Vegan", "Gluten-free", "Lactose-free", "None"].map((diet) => (
                    <div key={diet} className="flex items-center space-x-2">
                      <Checkbox id={diet.toLowerCase()} />
                      <label htmlFor={diet.toLowerCase()}>{diet}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-semibold mb-4">Daily Meal Count Preference</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { icon: Utensils, title: "3 Meals", subtitle: "Traditional" },
                    { icon: Apple, title: "5 Meals", subtitle: "With Snacks" },
                    { icon: Clock, title: "6+ Meals", subtitle: "Frequent Small" },
                  ].map((option) => (
                    <Card key={option.title} className="cursor-pointer hover:bg-accent">
                      <CardContent className="flex flex-col items-center p-4">
                        <option.icon className="h-6 w-6 mb-2" />
                        <h3 className="font-medium">{option.title}</h3>
                        <p className="text-sm text-muted-foreground">{option.subtitle}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-semibold mb-4">Caloric Intake Goal</h2>
                <div className="space-y-4">
                  <Slider defaultValue={[2000]} max={4000} min={1200} step={100} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1200 kcal</span>
                    <span>4000 kcal</span>
                  </div>
                </div>
              </div>

              <Button className="w-full">Continue to Activity Level</Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

