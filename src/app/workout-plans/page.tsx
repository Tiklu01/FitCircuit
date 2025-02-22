"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { PageHeader } from "@/components/ui/page-header";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  muscles: string[];
  imageUrl: string;
  caloriesBurned: number;
}

interface DayWorkout {
  day: number;
  type: string;
  exercises: Exercise[];
  duration: number;
  status: "completed" | "in-progress" | "upcoming";
}

interface WeekProgress {
  week: number;
  status: "completed" | "in-progress" | "upcoming";
  days: DayWorkout[];
}

interface WorkoutPlan {
  currentWeek: number;
  currentDay: number;
  streak: number;
  totalWorkouts: number;
  progress: WeekProgress[];
}

export default function WorkoutPlans() {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Fetch workout plan data from your API
    const fetchWorkoutPlan = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/workout`);
        if (response.ok) {
          const data = await response.json();
          const transformedData = transformWorkoutData(data.workoutPlan);
          setWorkoutPlan(transformedData);
          setSelectedWeek(transformedData.currentWeek);
          setSelectedDay(transformedData.currentDay);
        } else {
          console.error("Failed to fetch workout plan");
        }
      } catch (error) {
        console.error("Error fetching workout plan:", error);
      }
    };

    fetchWorkoutPlan();
  }, []);

  const transformWorkoutData = (data: any): WorkoutPlan => {
    const weeks = data.map((weekData: any, weekIndex: number) => ({
      week: weekIndex + 1,
      status: weekData.status || "upcoming",
      days: weekData.days.map((dayData: any) => ({
        day: dayData.day,
        type: "", // You can set a default type if needed
        exercises: dayData.exercises.map((exercise: any) => ({
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          muscles: exercise.muscleGroup || [],
          imageUrl: exercise.image || "",
        })),
        duration: dayData.exercises.reduce((total: number, exercise: any) => total + (exercise.time ? parseInt(exercise.time) : 0), 0),
        status: dayData.status || "upcoming",
      })),
    }));

    return {
      currentWeek: data.length > 0 ? data[0].days[0].day : 1,
      currentDay: data.length > 0 ? data[0].days[0].day : 1,
      streak: 0, // Replace with actual streak logic if available
      totalWorkouts: weeks.flatMap((week: any) => week.days).length,
      progress: weeks,
    };
  };

  const toggleExercise = (name: string) => {
    setCompletedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });

    const selectedExercises = workoutPlan?.progress[selectedWeek - 1]?.days.find((day) => day.day === selectedDay)?.exercises || [];
    const allExercisesCompleted = selectedExercises.every((ex) => completedExercises.has(ex.name));

    if (allExercisesCompleted) {
      setWorkoutPlan((prev) => {
        if (!prev) return prev;
        const updatedProgress = prev.progress.map((week) => ({
          ...week,
          days: week.days.map((day) => {
            if (day.day === selectedDay) {
              return { ...day, status: "completed" as "completed" };
            }
            return day;
          }),
        }));
        return { ...prev, progress: updatedProgress };
      });
    }
  };

  const handleWeekClick = (week: number) => {
    setSelectedWeek(week);
    setSelectedDay(workoutPlan?.progress[week - 1]?.days[0]?.day || 1);
  };

  const selectedExercises = workoutPlan?.progress[selectedWeek - 1]?.days.find((day) => day.day === selectedDay)?.exercises || [];
  const isDayCompleted = selectedExercises.length > 0 && selectedExercises.every((ex) => completedExercises.has(ex.name));

  if (!workoutPlan) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <main className="container mx-auto py-6 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center bg-black text-white p-6 rounded-lg">
            <div>
              <h1 className="text-2xl font-bold">Keep pushing, John!</h1>
              <p className="text-gray-300">"The only bad workout is the one that didn't happen."</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold">Week {selectedWeek}</h2>
              <p className="text-gray-300">Day {selectedDay} of {workoutPlan.progress[selectedWeek - 1]?.days.length || 0}</p>
            </div>
          </div>

          {/* Week Progress */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {workoutPlan.progress.map((week) => (
              <div
                key={week.week}
                className={`min-w-[120px] p-4 rounded-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-lg ${
                  selectedWeek === week.week
                    ? "bg-black text-white"
                    : week.status === "completed"
                    ? "bg-white border border-gray-200"
                    : "bg-white border border-gray-200"
                }`}
                onClick={() => handleWeekClick(week.week)}
              >
                <div className="text-sm">Week {week.week}</div>
                <div className="text-xs mt-1">
                  {week.status === "completed"
                    ? "Completed"
                    : week.status === "in-progress"
                    ? "In Progress"
                    : "Upcoming"}
                </div>
              </div>
            ))}
          </div>

          {/* Daily Workouts */}
          <div className="grid gap-4 md:grid-cols-4">
            {workoutPlan.progress[selectedWeek - 1].days.map((day) => (
              <Card
                key={day.day}
                className={`border ${
                  selectedDay === day.day ? "border-black" : "border-gray-200"
                } cursor-pointer hover:border-black transition-all duration-300 hover:shadow-lg`}
                onClick={() => setSelectedDay(day.day)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">Day {day.day}</h3>
                      <p className="text-sm text-muted-foreground">{day.type}</p>
                    </div>
                    {day.status === "completed" ? (
                      <Check className="text-green-500" />
                    ) : day.status === "in-progress" ? (
                      <Clock className="text-blue-500" />
                    ) : null}
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{day.exercises.length} exercises</p>
                    <p>{day.duration} minutes</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Day's Workout */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Day {selectedDay} Workout</h2>
            <div className="space-y-4">
              {selectedExercises.map((exercise) => (
                <Card key={exercise.name} className={completedExercises.has(exercise.name) ? "bg-muted" : ""}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Image
                        src={exercise.imageUrl || "/fit.jpeg"}
                        alt={exercise.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{exercise.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {exercise.sets} sets × {exercise.reps} reps
                            </p>
                          </div>
                          <Button
                            variant={completedExercises.has(exercise.name) ? "outline" : "ghost"}
                            size="sm"
                            onClick={() => toggleExercise(exercise.name)}
                          >
                            {completedExercises.has(exercise.name) ? <Check className="w-4 h-4" /> : "Complete"}
                          </Button>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {exercise.muscles.map((muscle) => (
                            <span key={muscle} className="inline-block px-2 py-1 text-xs rounded-full bg-secondary">
                              {muscle}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Progress Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">{workoutPlan.streak} day streak</div>
              <div className="text-sm text-muted-foreground">{workoutPlan.totalWorkouts} workouts completed</div>
            </div>
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
              Start Workout
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

