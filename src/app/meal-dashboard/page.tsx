"use client";

import { useState, useEffect } from "react";
import { Flame, CheckCircle, Dumbbell, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip } from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { PageHeader } from "@/components/ui/page-header";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip);

interface Meal {
  icon: string;
  name: string;
}

interface DayData {
  day: number;
  meals: Meal[];
  totalCalories: string;
  totalProtein: string;
  totalCarbs: string;
  totalFats: string;
}

interface MealAPIResponse {
  mealPlan: DayData[];
  message: string;
}

interface DayCardProps {
  day: string;
  date: string;
  status: "On Track" | "Near Goal";
  meals: Meal[];
  calories: number;
}

export default function WeeklyMealOverview() {
  const [mealData, setMealData] = useState<DayData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const currentWeekStart = new Date(2024, 1, 19);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meal`);
        const data: MealAPIResponse = await response.json();
        setMealData(data.mealPlan);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching meal data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !mealData) {
    return <div>Loading...</div>;
  }

  const calorieData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: mealData.map((day) => Number(day.totalCalories)),
        borderColor: "#818CF8",
        backgroundColor: "#818CF8",
        pointBackgroundColor: "#818CF8",
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const totalMacros = mealData.reduce(
    (acc, day) => {
      acc.protein += Number(day.totalProtein);
      acc.carbs += Number(day.totalCarbs);
      acc.fats += Number(day.totalFats);
      return acc;
    },
    { protein: 0, carbs: 0, fats: 0 }
  );
  const avgProtein = totalMacros.protein / mealData.length;
  const avgCarbs = totalMacros.carbs / mealData.length;
  const avgFats = totalMacros.fats / mealData.length;
  const totalAvg = avgProtein + avgCarbs + avgFats;
  const proteinPercent = Math.round((avgProtein / totalAvg) * 100);
  const carbsPercent = Math.round((avgCarbs / totalAvg) * 100);
  const fatsPercent = Math.round((avgFats / totalAvg) * 100);

  const macroData = {
    labels: ["Protein", "Carbs", "Fats"],
    datasets: [
      {
        data: [proteinPercent, carbsPercent, fatsPercent],
        backgroundColor: ["#818CF8", "#6EE7B7", "#FCD34D"],
        borderWidth: 0,
      },
    ],
  };

  const getDayName = (index: number): string => {
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return dayNames[index] || "";
  };

  const getDate = (index: number): number => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + index);
    return date.getDate();
  };

  const avgDailyCalories = Math.round(
    mealData.reduce((sum, day) => sum + Number(day.totalCalories), 0) / mealData.length
  );

  return (
    <main>
      <PageHeader />
      <div className="container mx-auto p-6 max-w-[1400px]">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Weekly Meal Overview</h1>
            <p className="text-gray-600">February 19 - February 25, 2024</p>
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
                <div className="text-xl font-semibold">{avgDailyCalories} kcal</div>
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
          {mealData.map((day, index) => (
            <DayCard
              key={index}
              day={getDayName(index)}
              date={getDate(index).toString()}
              status="On Track"
              meals={day.meals}
              calories={Number(day.totalCalories)}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-4">Weekly Calorie Trend</h3>
            <div className="h-[200px]">
              <Line
                data={calorieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { y: { min: 0, max: 2500, ticks: { stepSize: 500 } } },
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-4">Daily Macro Distribution</h3>
            <div className="h-[200px]">
              <Doughnut
                data={macroData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: "75%",
                  plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 15 } } },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DayCard({ day, date, status, meals, calories }: DayCardProps) {
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
        <Button variant="link" className="text-sm h-auto p-0">View Details</Button>
      </div>
    </Card>
  );
}
