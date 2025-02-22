"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dumbbell, Heart, MonitorIcon as Running, Target, Flame, Trophy } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { WorkoutPreferences } from "@/types/workout"
import { Toggle } from "@/components/ui/toggle"

const goals = [
  { icon: Dumbbell, label: "Weight Loss" },
  { icon: Flame, label: "Muscle Gain" },
  { icon: Running, label: "Endurance" },
  { icon: Heart, label: "General Fitness" },
  { icon: Target, label: "Flexibility & Mobility" },
  { icon: Trophy, label: "Event-Specific Training" },
]

export default function CustomizeWorkoutPlan() {
  const [preferences, setPreferences] = useState<WorkoutPreferences>({
    goal: "",
    eventName: "",
    height: 0,
    weight: 0,
    programDuration: "4 weeks",
    equipment: [],
    sessionLength: 45,
    weeklyFrequency: "3-4 times per week",
    noRestDays: false,
    intensityLevel: "intermediate",
    healthConsiderations: [],
    additionalDetails: "",
  })

  const [showEventName, setShowEventName] = useState(false)

  const handleGoalSelect = (goal: string) => {
    setPreferences((prev) => ({ ...prev, goal }))
    setShowEventName(goal === "Event-Specific Training")
  }

  const calculateBMI = () => {
    if (preferences.height && preferences.weight) {
      const heightInMeters = preferences.height / 100
      const bmi = preferences.weight / (heightInMeters * heightInMeters)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the preferences to your backend
    console.log("Submitting preferences:", preferences)
    // Redirect to the workout plan page
    window.location.href = "/workout-plans"
  }

  return (
    <div className="min-h-screen bg-background min-w-full">
      <PageHeader />
      <main className="container min-w-full px-6 py-6 ">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">Customize Your Workout Plan</h1>
            <p className="text-muted-foreground">Step 1 of 3 • Set Your Preferences</p>
            <div className="w-full bg-secondary h-2 mt-4 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-1/3" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Fitness Goals */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-4">What's your primary fitness goal?</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {goals.map((goal) => (
                    <Button
                      key={goal.label}
                      type="button"
                      variant={preferences.goal === goal.label ? "default" : "outline"}
                      className={`justify-start gap-2 ${
                        preferences.goal === goal.label ? "bg-gray-200 !important text-black" : "bg-transparent"
                      }`}                    
                    
                      onClick={() => handleGoalSelect(goal.label)}
                    >
                      <goal.icon className="h-4 w-4" />
                      {goal.label}
                    </Button>
                  ))}
                </div>

                {showEventName && (
                  <div className="mt-4">
                    <Label htmlFor="eventName">Event Name</Label>
                    <Input
                      id="eventName"
                      placeholder="Enter the specific event you're training for"
                      value={preferences.eventName}
                      onChange={(e) => setPreferences((prev) => ({ ...prev, eventName: e.target.value }))}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Body Metrics */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-4">Body Metrics</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="Enter your height"
                      value={preferences.height || ""}
                      onChange={(e) => setPreferences((prev) => ({ ...prev, height: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Enter your weight"
                      value={preferences.weight || ""}
                      onChange={(e) => setPreferences((prev) => ({ ...prev, weight: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                {preferences.height && preferences.weight && (
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
              </CardContent>
            </Card>

            {/* Training Duration & Equipment */}
            <Card>
              <CardContent className="p-6 space-y-6  ">
                <div>
                  <Label>Program Duration</Label>
                  <Select
                    value={preferences.programDuration}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, programDuration: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-100 text-black">
                      <SelectItem value="4 weeks">4 weeks</SelectItem>
                      <SelectItem value="8 weeks">8 weeks</SelectItem>
                      <SelectItem value="12 weeks">12 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Available Equipment</Label>
                  {[
                    "Home basics (bodyweight, resistance bands)",
                    "Free weights (dumbbells, kettlebells)",
                    "Full gym access",
                  ].map((equipment) => (
                    <div key={equipment} className="flex items-center space-x-2">
                      <Checkbox
                        id={equipment}
                        checked={preferences.equipment.includes(equipment)}
                        onCheckedChange={(checked) => {
                          setPreferences((prev) => ({
                            ...prev,
                            equipment: checked
                              ? [...prev.equipment, equipment]
                              : prev.equipment.filter((e) => e !== equipment),
                          }))
                        }}
                      />
                      <label htmlFor={equipment}>{equipment}</label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Workout Duration & Frequency */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label>Session Length (minutes)</Label>
                  <div className="pt-4 ">
                    <Slider
                      value={[preferences.sessionLength]}
                      onValueChange={([value]) => setPreferences((prev) => ({ ...prev, sessionLength: value }))}
                      min={30}
                      max={120}
                      step={5}
                      className="bg-[#4CAF50] rounded-full"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-muted-foreground">30 min</span>
                      <span className="text-sm font-medium ">{preferences.sessionLength} min</span>
                      <span className="text-sm text-muted-foreground">120 min</span>
                    </div>
                  </div>
                </div>

                <div >
                  <Label>Weekly Frequency</Label>
                  <Select
                    value={preferences.weeklyFrequency}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, weeklyFrequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-100 text-black">
                      <SelectItem value="1-2 times per week">1-2 times per week</SelectItem>
                      <SelectItem value="3-4 times per week">3-4 times per week</SelectItem>
                      <SelectItem value="5-6 times per week">5-6 times per week</SelectItem>
                      <SelectItem value="Every day">Every day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                <div className="space-y-0.5">
          <Label>No Rest Days</Label>
          <p className="text-sm text-muted-foreground">Recovery-focused training on rest days</p>
        </div>
        <Toggle
          pressed={preferences.noRestDays}
          onPressedChange={(pressed) => setPreferences((prev) => ({ ...prev, noRestDays: pressed }))}
          className="w-12 h-6 rounded-full bg-gray-300 data-[state=on]:bg-gray-400 relative transition-all"
        >
          <span
            className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-md transition-transform ${
              preferences.noRestDays ? "translate-x-6" : ""
            }`}
          />
        </Toggle>
        </div>
              </CardContent>
            </Card>

            {/* Intensity Level */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-4">Preferred Intensity Level</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { level: "beginner", label: "Beginner", desc: "Low Intensity" },
                    { level: "intermediate", label: "Intermediate", desc: "Moderate Intensity" },
                    { level: "advanced", label: "Advanced", desc: "High Intensity" },
                  ].map((intensity) => (
                    <Card
                      key={intensity.level}
                      className={`cursor-pointer transition-all duration-300 ease-in-out hover:bg-accent hover:shadow-lg ${
                        preferences.intensityLevel === intensity.level 
                          ? "bg-gray-200/80 text-black scale-105 shadow-md" 
                          : "bg-transparent"
                      }`} 
                      onClick={() => setPreferences((prev) => ({ ...prev, intensityLevel: intensity.level as any }))}
                    >
                      <CardContent className="flex flex-col items-center p-4">
                        <Running className="h-6 w-6 mb-2" />
                        <h3 className="font-medium">{intensity.label}</h3>
                        <p className="text-sm text-muted-foreground">{intensity.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Considerations */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="font-semibold">Health Considerations</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {["Joint problems", "Recent injuries", "Back pain", "Medical conditions"].map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={preferences.healthConsiderations.includes(condition)}
                        onCheckedChange={(checked) => {
                          setPreferences((prev) => ({
                            ...prev,
                            healthConsiderations: checked
                              ? [...prev.healthConsiderations, condition]
                              : prev.healthConsiderations.filter((c) => c !== condition),
                          }))
                        }}
                      />
                      <label htmlFor={condition}>{condition}</label>
                    </div>
                  ))}
                </div>
                <Textarea
                  placeholder="Please provide any additional information about your health conditions or limitations..."
                  value={preferences.additionalDetails}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, additionalDetails: e.target.value }))}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            <Button type="submit" className="w-full">
              Continue to Next Step
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  )
}

