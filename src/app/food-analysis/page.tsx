"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Camera, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface NutritionalInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export default function FoodAnalysis() {
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [weight, setWeight] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const chartData = {
    labels: ["Protein", "Carbs", "Fat"],
    datasets: [
      {
        data: [42, 12, 46],
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
    cutout: "60%",
    responsive: true,
    maintainAspectRatio: true,
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return

    const file = event.target.files[0]
    const formData = new FormData()
    formData.append("file", file)

    setUploading(true)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (data.success && data.imageUrl) {
        setUploadedUrl(data.imageUrl)
      } else {
        console.error("Upload response missing imageUrl:", data)
      }
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Food Analysis</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Side */}
        <div className="space-y-6">
          {/* Custom Quantity */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Custom Quantity (g)</h2>
            <Input
              type="number"
              placeholder="Enter weight in grams"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full mb-4 rounded-lg"
            />
            <Button className="w-full bg-black hover:bg-gray-800 rounded-lg">Analyze</Button>
          </div>

          {/* Image Upload */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl">
              <Camera className="h-8 w-8 mb-4 text-gray-400" />
              <p className="mb-4 text-sm text-gray-500">Upload your meal photo</p>
              <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              <Button variant="outline" onClick={handleButtonClick} disabled={uploading} className="rounded-lg">
                Select Image
              </Button>
              {uploadedUrl && (
                <img
                  src={uploadedUrl || "/placeholder.svg"}
                  alt="Uploaded meal"
                  className="mt-4 w-40 h-40 object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          {/* Macro Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Macro Distribution</h2>
            <div className="w-48 h-48 mx-auto mb-4">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
            <div className="grid grid-cols-3 text-center gap-4">
              <div>
                <div className="font-semibold">Protein</div>
                <div className="text-gray-500">42%</div>
              </div>
              <div>
                <div className="font-semibold">Carbs</div>
                <div className="text-gray-500">12%</div>
              </div>
              <div>
                <div className="font-semibold">Fat</div>
                <div className="text-gray-500">46%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Analysis Result</h2>

          <div className="space-y-8">
            {/* Food Identification */}
            <div>
              <h3 className="text-base text-gray-500 mb-2">Food Identification</h3>
              <h4 className="text-xl font-semibold mb-1">Grilled Chicken Salad</h4>
              <p className="text-gray-500">Estimated Weight: 320g</p>
            </div>

            {/* Nutritional Information */}
            <div>
              <h3 className="text-base text-gray-500 mb-4">Nutritional Information</h3>
              <div className="grid grid-cols-2 gap-y-4">
                <div className="flex items-center justify-between pr-4">
                  <span className="text-gray-600">Calories</span>
                  <span className="font-semibold">380 kcal</span>
                </div>
                <div className="flex items-center justify-between pr-4">
                  <span className="text-gray-600">Protein</span>
                  <span className="font-semibold">42g</span>
                </div>
                <div className="flex items-center justify-between pr-4">
                  <span className="text-gray-600">Carbs</span>
                  <span className="font-semibold">12g</span>
                </div>
                <div className="flex items-center justify-between pr-4">
                  <span className="text-gray-600">Fat</span>
                  <span className="font-semibold">18g</span>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-base text-gray-500 mb-4">Ingredients</h3>
              <div className="grid grid-cols-2 gap-y-3">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Grilled Chicken Breast</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Mixed Lettuce</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Cherry Tomatoes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Olive Oil Dressing</span>
                </div>
              </div>
            </div>

            {/* Nutritional Breakdown */}
            <div>
              <h3 className="text-base text-gray-500">Nutritional Breakdown</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

