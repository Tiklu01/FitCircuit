/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { PageHeader } from "@/components/ui/page-header";

ChartJS.register(ArcElement, Tooltip, Legend);

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
  status: "completed" | "pending";
}

interface WeekProgress {
  week: number;
  status: "completed" | "pending";
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
  const [workoutStarted, setWorkoutStarted] = useState<boolean>(false);
  const [completedExercisesByDay, setCompletedExercisesByDay] = useState<Record<string, Set<string>>>({});
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/workout`);
        if (response.ok) {
          const data = await response.json();
          const transformedData = transformWorkoutData(data.workoutPlan);
          setWorkoutPlan(transformedData);
          setSelectedWeek(transformedData.currentWeek);
          setSelectedDay(transformedData.currentDay);
        }
      } catch (error) {
        console.error("Error fetching workout plan:", error);
      }
    };
    fetchWorkoutPlan();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const transformWorkoutData = (data: any): WorkoutPlan => {
    const weeks = data.map((weekData: any, weekIndex: number) => ({
      week: weekIndex + 1,
      status: weekData.status as "completed" | "pending",
      days: weekData.days.map((dayData: any) => ({
        day: dayData.day,
        type: "",
        exercises: dayData.exercises.map((exercise: any) => ({
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          muscles: exercise.muscleGroup || [],
          imageUrl: exercise.image || "",
          caloriesBurned: exercise.caloriesBurned || 0,
        })),
        duration: dayData.exercises.reduce((total: number, exercise: any) => total + (exercise.time ? parseInt(exercise.time) : 0), 0),
        status: dayData.status as "completed" | "pending",
      })),
    }));

    return {
      currentWeek: data.findIndex((week: any) => week.status === "pending") + 1 || 1,
      currentDay: data[0]?.days.find((day: any) => day.status === "pending")?.day || 1,
      streak: calculateStreak(weeks),
      totalWorkouts: weeks.flatMap((week: any) => week.days).length,
      progress: weeks,
    };
  };

  const calculateStreak = (weeks: WeekProgress[]): number => {
    let streak = 0;
    let maxStreak = 0;
    weeks.forEach((week) => {
      week.days.forEach((day) => {
        day.status === "completed" ? streak++ : streak = 0;
        maxStreak = Math.max(maxStreak, streak);
      });
    });
    return maxStreak;
  };

  const toggleExercise = (name: string) => {
    if (!workoutStarted) return;
    setCompletedExercisesByDay(prev => {
      const dayKey = selectedDay.toString();
      const updatedSet = new Set(prev[dayKey] || []);
      updatedSet.has(name) ? updatedSet.delete(name) : updatedSet.add(name);
      return { ...prev, [dayKey]: updatedSet };
    });
  };

  const handleWeekClick = (week: number) => {
    setSelectedWeek(week);
    setSelectedDay(workoutPlan?.progress[week - 1]?.days[0]?.day || 1);
  };

  const handleEndWorkout = async () => {
    if (!workoutPlan) return;
    
    const allExercisesCompleted = selectedExercises.every(ex => 
      completedExercisesByDay[selectedDay.toString()]?.has(ex.name)
    );

    if (allExercisesCompleted) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/workout/change-status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            weekNumber: selectedWeek,
            dayNumber: selectedDay,
            status: "completed",
          }),
        });

        setWorkoutPlan(prev => prev ? {
          ...prev,
          progress: prev.progress.map(week => ({
            ...week,
            days: week.days.map(day => day.day === selectedDay ? 
              { ...day, status: "completed" } : day)
          }))
        } : null);
      } catch (error) {
        console.error("Error updating day status:", error);
      }
    }
    
    setWorkoutStarted(false);
    setIsTimerRunning(false);
    setTimeElapsed(0);
  };

  const selectedExercises = workoutPlan?.progress[selectedWeek - 1]?.days
    .find(day => day.day === selectedDay)?.exercises || [];

  const dailyCalorieGoal = selectedExercises.reduce((total, ex) => total + ex.caloriesBurned, 0);
  const completedExercises = completedExercisesByDay[selectedDay.toString()] || new Set();
  const caloriesBurned = selectedExercises
    .filter(ex => completedExercises.has(ex.name))
    .reduce((sum, ex) => sum + ex.caloriesBurned, 0);

  const chartData = {
    labels: ['Calories Burned', 'Remaining Calories'],
    datasets: [{
      data: [caloriesBurned, Math.max(dailyCalorieGoal - caloriesBurned, 0)],
      backgroundColor: ['#FF6384', '#36A2EB'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB'],
    }],
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`);
        if (response.ok) {
          const data = await response.json();
            setUser(data.user); // ✅ Store user data in state
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
fetchUser();
},[])

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' as const } }
  };

  if (!workoutPlan) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      <main className="container mx-auto py-6 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center bg-black text-white p-6 rounded-lg">
            <div>
            
           
              <h1 className="text-2xl font-bold">Keep pushing, @{user?.username || "Champion"}!</h1>
              <p className="text-gray-300">&quot;The only bad workout is the one that didn&apos;t happen.&quot;</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold">Week {selectedWeek}</h2>
              <p className="text-gray-300">Day {selectedDay} of {workoutPlan.progress[selectedWeek - 1]?.days.length || 0}</p>
            </div>
          </div>

          {/* Week Selection */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {workoutPlan.progress.map(week => (
              <div
                key={week.week}
                className={`min-w-[120px] p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedWeek === week.week ? "bg-black text-white" : "bg-white border"
                }`}
                onClick={() => handleWeekClick(week.week)}
              >
                <div className="text-sm">Week {week.week}</div>
                <div className="text-xs mt-1">{week.status === "completed" ? "Completed" : ""}</div>
              </div>
            ))}
          </div>

          {/* Day Selection */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {workoutPlan.progress[selectedWeek - 1]?.days.map(day => (
              <Card
                key={day.day}
                className={`border cursor-pointer transition-all ${
                  selectedDay === day.day ? "border-black" : "border-gray-200"
                }`}
                onClick={() => setSelectedDay(day.day)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Day {day.day}</h3>
                      <p className="text-sm text-muted-foreground">{day.exercises.length} exercises</p>
                    </div>
                    {day.status === "completed" ? (
                      <Check className="text-green-500" />
                    ) : (
                      <Clock className="text-blue-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Workout Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-4">Day {selectedDay} Workout</h2>
              <div className="space-y-4">
                {selectedExercises.map(exercise => (
                  <Card key={exercise.name} className={completedExercises.has(exercise.name) ? "bg-muted" : ""}>
                    <CardContent className="p-4">
                      <div className="flex gap-4 items-center">
                        <Image
                          src={exercise.imageUrl || "/default-exercise.jpg"}
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
                              <p className="text-sm text-muted-foreground">
                                {exercise.caloriesBurned} calories
                              </p>
                            </div>
                            <Button
                              variant={completedExercises.has(exercise.name) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleExercise(exercise.name)}
                              disabled={!workoutStarted}
                            >
                              {completedExercises.has(exercise.name) ? "Completed" : "Mark Complete"}
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {exercise.muscles.map(muscle => (
                              <span key={muscle} className="px-2 py-1 text-xs rounded-full bg-secondary">
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

            {/* Progress Chart */}
            <div className="lg:w-96 mt-24">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Daily Progress ({caloriesBurned}/{dailyCalorieGoal} calories)
                </h3>
                <div className="relative aspect-square">
                  <Doughnut data={chartData} options={chartOptions} />
                </div>
                <div className="mt-4 text-center text-sm">
                  {caloriesBurned === dailyCalorieGoal ? (
                    <span className="text-green-500">Workout Completed! 🎉</span>
                  ) : (
                    `${dailyCalorieGoal - caloriesBurned} calories remaining`
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Footer with Timer */}
          <div className="flex justify-between items-center pt-4 border-t mx-5">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-muted-foreground">{workoutPlan.streak} day streak</p>
                
              </div>
              {workoutStarted && (
                <div className="flex items-center gap-2">
                  <div className="w-px h-6 bg-border" />
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                    </span>
                    <div className="font-mono text-sm font-medium">
                      {formatTime(timeElapsed)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Button
              size="lg"
              className="bg-black hover:bg-gray-800 text-white"
              onClick={() => {
                if (workoutStarted) {
                  handleEndWorkout();
                } else {
                  setWorkoutStarted(true);
                  setIsTimerRunning(true);
                }
              }}
            >
              {workoutStarted ? "End Workout" : "Start Workout"}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}