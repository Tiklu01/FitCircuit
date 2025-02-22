"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Dumbbell, Utensils, Scale } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@clerk/nextjs" // Clerk authentication

const features = [
  {
    icon: Dumbbell,
    title: "Smart Workout Planning",
    description: "Get personalized workout plans that adapt to your progress and preferences.",
    link: "/workout-plans/customize", // Link for this feature
  },
  {
    icon: Utensils,
    title: "Meal Planning",
    description: "Receive customized meal plans that align with your dietary needs and goals.",
    link: "/meal-plans/customize", // Link for this feature
  },
  {
    icon: Scale,
    title: "Nutrition Tracking",
    description: "Track your meals and get real-time nutritional insights with AI-powered food analysis.",
    link: "/meal-dashboard", // Link for this feature
  },
]

export default function Home() {
  const { isSignedIn } = useAuth() // Check if user is logged in

  return (
    <div className="min-h-screen w-full bg-background">
      <PageHeader />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-slate-50">
          <motion.div
            className="container text-center max-w-4xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Your Personal Fitness Journey Starts Here
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              AI-powered workout plans and nutrition guidance tailored to your goals
            </p>
            <Button asChild size="lg" className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-8">
              <Link href={isSignedIn ? "/workout-plans/customize" : "/auth/login?tab=register"}>
                Start Your Journey
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                >
                  →
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto">
            <motion.h2
              className="text-3xl font-bold text-center mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Our Features
            </motion.h2>
            <div className="grid md:grid-cols-3 w-full gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Link href={isSignedIn ? feature.link : "/auth/login?tab=register"}>
                    <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="mb-4">
                          <feature.icon className="w-10 h-10 text-[#4CAF50]" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}