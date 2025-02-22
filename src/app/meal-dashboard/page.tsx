"use client"

import { useState } from "react"
import { Flame, CheckCircle, Dumbbell, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip } from "chart.js"
import { Line, Doughnut } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip)

export default function WeeklyMealOverview() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentWeekStart] = useState(new Date(2024, 1, 19))

  return (
    <div className="container mx-auto p-6 max-w-[1400px]">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Weekly Meal Overview</h1>
          <p className="text-gray-600">February 19 - February 25, 2024</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            ← Previous Week
          </Button>
          <Button variant="default" size="sm">
            Next Week →
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Avg. Daily Calories</div>
              <div className="text-xl font-semibold">2,145 kcal</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Plan Compliance</div>
              <div className="text-xl font-semibold">92%</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
              <Dumbbell className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Protein Goal</div>
              <div className="text-xl font-semibold">156g / 180g</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center">
              <Scale className="h-4 w-4 text-yellow-500" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Macro Balance</div>
              <div className="text-xl font-semibold">Optimal</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-7 mb-8">
        {DAYS.map((day, index) => (
          <DayCard key={index} {...day} />
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-6">Detailed Day View</h2>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500">☀️</span>
              <h3 className="font-medium">Breakfast</h3>
              <span className="text-gray-500 text-sm">8:00 AM</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-medium mb-2">Oatmeal with Fruits</div>
              <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                <div>320 kcal</div>
                <div>P: 12g</div>
                <div>C: 45g</div>
                <div>F: 8g</div>
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            <div>
              <h3 className="font-medium mb-4">Daily Macro Distribution</h3>
              <div className="h-[200px]">
                <Doughnut
                  data={macroData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "75%",
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          boxWidth: 12,
                          padding: 15,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Weekly Calorie Trend</h3>
              <div className="h-[200px]">
                <Line
                  data={calorieData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        min: 0,
                        max: 2500,
                        ticks: {
                          stepSize: 500,
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DayCard({
  day,
  date,
  status,
  meals,
  calories,
}: {
  day: string
  date: string
  status: "On Track" | "Near Goal"
  meals: { icon: string; name: string }[]
  calories: number
}) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="font-medium">{day}</div>
          <div className="text-sm text-gray-600">Feb {date}</div>
        </div>
        <Badge variant={status === "On Track" ? "success" : "warning"} className="text-xs">
          {status}
        </Badge>
      </div>
      <div className="space-y-2 mb-4">
        {meals.map((meal, index) => (
          <div key={index} className="flex items-center gap-2">
            <span>{meal.icon}</span>
            <span className="text-sm">{meal.name}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
        <span className="text-sm text-gray-600">{calories} kcal</span>
        <Button variant="link" className="text-sm h-auto p-0">
          View Details
        </Button>
      </div>
    </Card>
  )
}

const DAYS = [
  {
    day: "Monday",
    date: "19",
    status: "On Track" as const,
    meals: [
      { icon: "☀️", name: "Oatmeal & Berries" },
      { icon: "🍽️", name: "Grilled Chicken Salad" },
      { icon: "🌙", name: "Salmon & Quinoa" },
    ],
    calories: 2090,
  },
  {
    day: "Tuesday",
    date: "20",
    status: "On Track" as const,
    meals: [
      { icon: "☀️", name: "Protein Pancakes" },
      { icon: "🍽️", name: "Turkey Wrap" },
      { icon: "🌙", name: "Steak & Vegetables" },
    ],
    calories: 2150,
  },
  {
    day: "Wednesday",
    date: "21",
    status: "On Track" as const,
    meals: [
      { icon: "☀️", name: "Greek Yogurt Bowl" },
      { icon: "🍽️", name: "Tuna Salad" },
      { icon: "🌙", name: "Chicken Stir-Fry" },
    ],
    calories: 2180,
  },
  {
    day: "Thursday",
    date: "22",
    status: "Near Goal" as const,
    meals: [
      { icon: "☀️", name: "Smoothie Bowl" },
      { icon: "🍽️", name: "Quinoa Buddha Bowl" },
      { icon: "🌙", name: "Fish Tacos" },
    ],
    calories: 2050,
  },
  {
    day: "Friday",
    date: "23",
    status: "On Track" as const,
    meals: [
      { icon: "☀️", name: "Avocado Toast" },
      { icon: "🍽️", name: "Poke Bowl" },
      { icon: "🌙", name: "Tofu Curry" },
    ],
    calories: 2120,
  },
  {
    day: "Saturday",
    date: "24",
    status: "On Track" as const,
    meals: [
      { icon: "☀️", name: "Protein Waffles" },
      { icon: "🍽️", name: "Chicken Caesar Wrap" },
      { icon: "🌙", name: "Grilled Steak" },
    ],
    calories: 2200,
  },
  {
    day: "Sunday",
    date: "25",
    status: "On Track" as const,
    meals: [
      { icon: "☀️", name: "Eggs Benedict" },
      { icon: "🍽️", name: "Mediterranean Bowl" },
      { icon: "🌙", name: "Baked Salmon" },
    ],
    calories: 2170,
  },
]

const macroData = {
  labels: ["Protein", "Carbs", "Fats"],
  datasets: [
    {
      data: [30, 45, 25],
      backgroundColor: ["#818CF8", "#6EE7B7", "#FCD34D"],
      borderWidth: 0,
    },
  ],
}

const calorieData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [2090, 2150, 2180, 2050, 2120, 2200, 2170],
      borderColor: "#818CF8",
      backgroundColor: "#818CF8",
      pointBackgroundColor: "#818CF8",
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 4,
    },
  ],
}

