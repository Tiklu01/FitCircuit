"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Dumbbell, Utensils, Scale, Brain, ChefHat, Globe, Target, Users, Stethoscope, Lock } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@clerk/nextjs" // Clerk authentication

const features = [
  {
    icon: Dumbbell,
    title: "Smart Workout Planning",
    description: "Get personalized workout plans that adapt to your progress and preferences.",
    link: "/workout-plans/customize",
  },
  {
    icon: Utensils,
    title: "Meal Planning",
    description: "Receive customized meal plans that align with your dietary needs and goals.",
    link: "/meal-plans/customize",
  },
  {
    icon: Scale,
    title: "Nutrition Tracking",
    description: "Track your meals and get real-time nutritional insights with AI-powered food analysis.",
    link: "/meal-dashboard",
  },
]

const premiumFeatures = [
  {
    icon: ChefHat,
    title: "Smart Meal Generation",
    description: "Create meals with ingredients you have at hand",
    link: "/premium/meal-generation",
  },
  {
    icon: Globe,
    title: "Cuisine Preferences",
    description: "Choose your favorite cuisine for personalized recipes",
    link: "/premium/cuisines",
  },
  {
    icon: Brain,
    title: "Detailed AI Insights",
    description: "Get more detailed analysis of your progress",
    link: "/premium/insights",
  },
  {
    icon: Target,
    title: "Enhanced Personalization",
    description: "Receive hyper-personalized workout recommendations",
    link: "/premium/personalization",
  },
  {
    icon: Users,
    title: "Social & Leaderboards",
    description: "Connect and compete with the fitness community",
    link: "/premium/social",
  },
  {
    icon: Stethoscope,
    title: "Expert Consultation",
    description: "Get guidance from certified health experts",
    link: "/premium/consultation",
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

        {/* Premium Features Section */}
        <section className="py-20 bg-slate-50">
          <div className="container px-4 mx-auto">
            <motion.h2
              className="text-3xl font-bold text-center mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Premium Features
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-8 max-w-6xl mx-auto">
              {premiumFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Link href={isSignedIn ? feature.link : "/auth/login?tab=register"}>
                    <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow relative group overflow-hidden">
                      <CardContent className="pt-6">
                        <div className="mb-4 relative">
                          <feature.icon className="w-10 h-10 text-[#4CAF50]" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Lock className="w-8 h-8 text-white mb-2" />
                          <Button variant="secondary" size="sm" className="absolute bottom-4">
                            Unlock Premium
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto text-center">
            <motion.h2
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Ready to Transform Your Life?
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-lg mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join our community and start your fitness journey today!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button asChild size="lg" className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-8">
                <Link href="/sign-up">Sign Up Now</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}

