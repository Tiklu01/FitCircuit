/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Camera, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { PageHeader } from "@/components/ui/page-header"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function FoodAnalysis() {
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [foodData, setFoodData] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (foodData) {
      console.log("Fetched Data:", foodData)
    }
  }, [foodData])

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return

    const file = event.target.files[0]
    const formData = new FormData()
    formData.append("file", file)

    setUploading(true)
    setLoading(true) // Start loading animation

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meal/analysis`, {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      setFoodData(data.jsonResponse)
      setUploadedUrl(data.imagePart)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
      setLoading(false) // Stop loading animation
    }
  }

  const chartData = foodData
    ? {
        labels: ["Protein", "Carbs", "Fat"],
        datasets: [
          {
            data: [
              parseInt(foodData.nutritional_information.protein),
              parseInt(foodData.nutritional_information.carbohydrates),
              parseInt(foodData.nutritional_information.fats),
            ],
            backgroundColor: ["#818CF8", "#4ADE80", "#F59E0B"],
            borderWidth: 0,
          },
        ],
      }
    : null

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <PageHeader />
      <h1 className="text-2xl font-bold mb-6 py-4">Food Analysis</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl">
              <Camera className="h-8 w-8 mb-4 text-gray-400" />
              <p className="mb-4 text-sm text-gray-500">Upload your meal photo</p>
              <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              <Button variant="outline" onClick={handleButtonClick} disabled={uploading} className="rounded-lg">
                {uploading ? "Uploading..." : "Select Image"}
              </Button>
              {uploadedUrl && <img src={uploadedUrl} alt="Uploaded meal" className="mt-4 w-40 h-40 object-cover rounded-lg" />}
            </div>
          </div>

          {/* Chart with Fixed Size */}
          <div className="bg-white p-6 rounded-2xl shadow-sm max-w-full">
            <h2 className="text-lg font-semibold mb-4">Macro Distribution</h2>
            <div className="flex-col w-[350px] h-[350px] mx-auto">
            {loading ? (
              <div className="w-48 h-48 mx-auto bg-gray-200 rounded-full animate-pulse"></div>
            ) : (
              chartData && <Doughnut data={chartData} width={200} height={200} />
            )}
          </div>
            </div>
           
        </div>

        {/* Skeleton Loader for Analysis Result */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Analysis Result</h2>
          {loading ? (
            <div className="space-y-6">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          ) : (
            foodData && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base text-gray-500 mb-2">Food Identification</h3>
                  {foodData.food_identification.map((item: any, index: number) => (
                    <div key={index} className="mb-2">
                      <h4 className="text-xl font-semibold">{item.item}</h4>
                      <p className="text-gray-500">Estimated Weight: {item.estimated_weight}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-base text-gray-500 mb-4">Nutritional Information</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between"><span>Calories:</span><span>{foodData.nutritional_information.calories}</span></div>
                    <div className="flex justify-between"><span>Protein:</span><span>{foodData.nutritional_information.protein}</span></div>
                    <div className="flex justify-between"><span>Carbs:</span><span>{foodData.nutritional_information.carbohydrates}</span></div>
                    <div className="flex justify-between"><span>Fat:</span><span>{foodData.nutritional_information.fats}</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base text-gray-500 mb-4">Ingredients</h3>
                  {foodData.recipe.ingredients.map((ingredient: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-gray-400" />
                      <span>{ingredient.name} - {ingredient.quantity}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-base text-gray-500 mb-4">Recipe Instructions</h3>
                  <ol className="list-decimal pl-6">
                    {foodData.recipe.instructions.map((step: string, index: number) => (
                      <li key={index} className="mb-2">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}