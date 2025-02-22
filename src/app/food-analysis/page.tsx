"use client"

import { motion } from "framer-motion"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Camera } from "lucide-react"

export default function FoodAnalysis() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <main className="container py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <h1 className="text-2xl font-bold tracking-tight">Food Analysis</h1>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Quantity (g)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input type="number" placeholder="Enter weight in grams" className="mb-4" />
                  <Button>Analyze</Button>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Camera className="h-8 w-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">Upload your meal photo</p>
                  <Button variant="outline">Select Image</Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Analysis Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-2">Food Identification</h3>
                    <p className="text-sm text-muted-foreground">Item: Grilled Chicken Salad</p>
                    <p className="text-sm text-muted-foreground">Estimated Weight: 320g</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Nutritional Information</h3>
                    <p className="text-sm text-muted-foreground">Calories: 380 kcal</p>
                    <p className="text-sm text-muted-foreground">Protein: 42g</p>
                    <p className="text-sm text-muted-foreground">Carbs: 12g</p>
                    <p className="text-sm text-muted-foreground">Fat: 18g</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Ingredients</h3>
                  <div className="grid gap-2 grid-cols-2">
                    <div className="text-sm text-muted-foreground">• Grilled Chicken Breast</div>
                    <div className="text-sm text-muted-foreground">• Mixed Lettuce</div>
                    <div className="text-sm text-muted-foreground">• Cherry Tomatoes</div>
                    <div className="text-sm text-muted-foreground">• Olive Oil Dressing</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

