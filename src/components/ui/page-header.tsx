"use client";
import Link from "next/link";
import { Dumbbell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth, UserButton } from "@clerk/nextjs"; // Clerk authentication & user button

export function PageHeader() {
  const { isSignedIn } = useAuth(); // Check if user is logged in
  const [isDietDropdownOpen, setDietDropdownOpen] = useState(false);

  return (
    <header className=" top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center min-w-full px-2">
        <Link href="/" className="flex items-center space-x-2 pl-3">
          <Dumbbell className="h-6 w-6 text-[#4CAF50]" />
          <span className="font-bold">FitCircuit</span>
        </Link>

        {isSignedIn && ( // Show workout & diet features only if logged in
          <nav className="flex items-center space-x-6 ml-6">
            <Link href="/workout-plans" className="text-sm font-medium transition-colors hover:text-[#4CAF50]">
              Workout Dashboard
            </Link>
            <Link href="/workout-plans/customize" className="text-sm font-medium transition-colors hover:text-[#4CAF50]">
              Workout Builder
            </Link>
            <Link href="/meal-dashboard" className="text-sm font-medium transition-colors hover:text-[#4CAF50]">
              Meal Dashboard
            </Link>
            {/* Diet Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDietDropdownOpen(!isDietDropdownOpen)}
                className="flex items-center text-sm font-medium transition-colors hover:text-[#4CAF50]"
              >
                Diet <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isDietDropdownOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-white/80 backdrop-blur-md shadow-md rounded-lg border border-gray-200">
                  <Link href="/meal-plans/customize" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200/50">
                    Meal Plans
                  </Link>
                  <Link href="/food-analysis" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200/50">
                    Food Analysis
                  </Link>
                  <Link href="/nutrition" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200/50">
                    Nutrition
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}

        <div className="ml-auto flex items-center space-x-4">
          {!isSignedIn ? (
            <>
              <Button className="bg-[#4CAF50] hover:bg-[#45a049]" variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button className="bg-[#4CAF50] hover:bg-[#45a049] hidden sm:block" asChild>
                <Link href="/auth/login?tab=register">Get Started</Link>
              </Button>
            </>
          ) : (
            <UserButton afterSignOutUrl="/" /> // Clerk's profile button with user management
          )}
        </div>
      </div>
    </header>
  );
}
