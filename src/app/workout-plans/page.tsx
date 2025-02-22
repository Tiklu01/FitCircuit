"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Check, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import type { WorkoutPlan, Exercise, WorkoutDay, DayWorkout  } from "@/types/workout"

const mockWorkoutPlan: WorkoutPlan = {
  currentWeek: 3,
  currentDay: 2,
  streak: 14,
  totalWorkouts: 32,
  progress: [
    {
      week: 1,
      status: "completed",
      days: [
        { day: 1, type: "Upper Body", exercises: 8, duration: 45, status: "completed" },
        { day: 2, type: "Lower Body", exercises: 6, duration: 40, status: "completed" },
        { day: 3, type: "Core & Cardio", exercises: 7, duration: 35, status: "completed" },
        { day: 4, type: "Full Body", exercises: 10, duration: 50, status: "completed" },
      ],
    },
    {
      week: 2,
      status: "completed",
      days: Array(4)
        .fill(null)
        .map((_, i) => ({
          day: i + 1,
          type: ["Upper Body", "Lower Body", "Core & Cardio", "Full Body"][i],
          exercises: [8, 6, 7, 10][i],
          duration: [45, 40, 35, 50][i],
          status: "completed",
        })),
    },
    {
      week: 3,
      status: "in-progress",
      days: [
        { day: 1, type: "Upper Body", exercises: 8, duration: 45, status: "completed" },
        { day: 2, type: "Lower Body", exercises: 6, duration: 40, status: "in-progress" },
        { day: 3, type: "Core & Cardio", exercises: 7, duration: 35, status: "upcoming" },
        { day: 4, type: "Full Body", exercises: 10, duration: 50, status: "upcoming" },
      ],
    },
    {
      week: 4,
      status: "upcoming",
      days: Array(4)
        .fill(null)
        .map((_, i) => ({
          day: i + 1,
          type: ["Upper Body", "Lower Body", "Core & Cardio", "Full Body"][i],
          exercises: [8, 6, 7, 10][i],
          duration: [45, 40, 35, 50][i],
          status: "upcoming",
        })),
    },
  ],
}

const exerciseData: Record<number, Exercise[]> = {
  1: [
    { id: "1", name: "Push-ups", sets: 3, reps: 15, muscles: ["Chest", "Arms"], imageUrl: "/placeholder.svg" },
    { id: "2", name: "Pull-ups", sets: 3, reps: 10, muscles: ["Back", "Arms"], imageUrl: "/placeholder.svg" },
    { id: "3", name: "Dumbbell Bench Press", sets: 4, reps: 12, muscles: ["Chest", "Triceps"], imageUrl: "/placeholder.svg" },
    { id: "4", name: "Tricep Dips", sets: 3, reps: 12, muscles: ["Triceps"], imageUrl: "/placeholder.svg" },
  ],
  2: [
    { id: "5", name: "Squats", sets: 4, reps: 12, muscles: ["Legs", "Glutes"], imageUrl: "/placeholder.svg" },
    { id: "6", name: "Lunges", sets: 3, reps: 12, muscles: ["Legs"], imageUrl: "/placeholder.svg" },
    { id: "7", name: "Leg Press", sets: 3, reps: 15, muscles: ["Legs", "Calves"], imageUrl: "/placeholder.svg" },
    { id: "8", name: "Calf Raises", sets: 4, reps: 20, muscles: ["Calves"], imageUrl: "/placeholder.svg" },
  ],
  3: [
    { id: "9", name: "Deadlifts", sets: 4, reps: 10, muscles: ["Back", "Legs"], imageUrl: "/placeholder.svg" },
    { id: "10", name: "Bent-over Rows", sets: 3, reps: 12, muscles: ["Back", "Biceps"], imageUrl: "/placeholder.svg" },
    { id: "11", name: "Lat Pulldown", sets: 3, reps: 15, muscles: ["Back"], imageUrl: "/placeholder.svg" },
    { id: "12", name: "Face Pulls", sets: 3, reps: 12, muscles: ["Shoulders"], imageUrl: "/placeholder.svg" },
  ],
  4: [
    { id: "13", name: "Bicep Curls", sets: 3, reps: 15, muscles: ["Biceps"], imageUrl: "/placeholder.svg" },
    { id: "14", name: "Hammer Curls", sets: 3, reps: 12, muscles: ["Biceps", "Forearms"], imageUrl: "/placeholder.svg" },
    { id: "15", name: "Preacher Curls", sets: 3, reps: 12, muscles: ["Biceps"], imageUrl: "/placeholder.svg" },
    { id: "16", name: "Wrist Curls", sets: 3, reps: 15, muscles: ["Forearms"], imageUrl: "/placeholder.svg" },
  ],
  5: [
    { id: "17", name: "Overhead Shoulder Press", sets: 3, reps: 12, muscles: ["Shoulders", "Triceps"], imageUrl: "/placeholder.svg" },
    { id: "18", name: "Lateral Raises", sets: 3, reps: 15, muscles: ["Shoulders"], imageUrl: "/placeholder.svg" },
    { id: "19", name: "Front Raises", sets: 3, reps: 12, muscles: ["Shoulders"], imageUrl: "/placeholder.svg" },
    { id: "20", name: "Shrugs", sets: 4, reps: 15, muscles: ["Traps"], imageUrl: "/placeholder.svg" },
  ],
  6: [
    { id: "21", name: "Russian Twists", sets: 3, reps: 20, muscles: ["Core"], imageUrl: "/placeholder.svg" },
    { id: "22", name: "Planks", sets: 3, reps: 60, muscles: ["Core"], imageUrl: "/placeholder.svg" },
    { id: "23", name: "Leg Raises", sets: 3, reps: 15, muscles: ["Core"], imageUrl: "/placeholder.svg" },
    { id: "24", name: "Bicycle Crunches", sets: 3, reps: 20, muscles: ["Core"], imageUrl: "/placeholder.svg" },
  ],
  7: [
    { id: "25", name: "Jump Rope", sets: 3, reps: 2, muscles: ["Cardio"], imageUrl: "/placeholder.svg" },
    { id: "26", name: "Rowing Machine", sets: 3, reps: 5, muscles: ["Cardio"], imageUrl: "/placeholder.svg" },
    { id: "27", name: "Burpees", sets: 3, reps: 12, muscles: ["Full Body"], imageUrl: "/placeholder.svg" },
    { id: "28", name: "Mountain Climbers", sets: 3, reps: 20, muscles: ["Full Body"], imageUrl: "/placeholder.svg" },
  ],
};

const todaysExercises: Exercise[] = [
  // {
  //   id: "1",
  //   name: "Barbell Squats",
  //   sets: 4,
  //   reps: 12,
  //   muscles: ["Legs", "Glutes"],
  //   imageUrl: "/placeholder.svg",
  // },
  // {
  //   id: "2",
  //   name: "Romanian Deadlifts",
  //   sets: 3,
  //   reps: 15,
  //   muscles: ["Legs", "Back"],
  //   imageUrl: "/placeholder.svg",
  // },
]

export default function WorkoutPlans() {
  const [workoutPlan] = useState<WorkoutPlan>(mockWorkoutPlan)
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set())
  const [selectedDayExercises, setSelectedDayExercises] = useState<Exercise[]>(todaysExercises); // Default to today's exercises
  
  const [completedExercisesByDay, setCompletedExercisesByDay] = useState<Record<string, Set<string>>>({});

  const [selectedDay, setSelectedDay] = useState<{ day: number } | null>({ day: 0 });

  



  const handleDayClick = (day: DayWorkout) => {
    setSelectedDayExercises(exerciseData[day.day] || []);
  };

 
  const toggleExercise = (id: string) => {
    setCompletedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  
  
  
setCompletedExercisesByDay((prev) => {
  if (!selectedDay?.day) return prev; // Ensure selectedDay exists

  const dayKey = selectedDay.day;
  const updatedSet = new Set(prev[dayKey] || []);

  if (updatedSet.has(id)) {
    updatedSet.delete(id);
  } else {
    updatedSet.add(id);
  }

  return { ...prev, [dayKey]: updatedSet };
});
  }
  
  const isDayCompleted = (day: DayWorkout) => {
   if (!selectedDay) return false; // Prevent errors
     const dayKey = selectedDay.day;
    const completedSet = completedExercisesByDay[dayKey] || new Set();
    
    return todaysExercises.length > 0 && todaysExercises.every(ex => completedSet.has(ex.id));
  };
  
  

  return (
    <div className="min-h-screen bg-background min-w-full">
      <PageHeader />
      <main className="container py-6 min-w-full px-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Keep pushing, {process.env.NEXT_PUBLIC_USER_NAME || "Champion"}!</h1>
              <p className="text-muted-foreground">"The only bad workout is the one that didn't happen."</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold">Week {workoutPlan.currentWeek}</h2>
              <p className="text-muted-foreground">Day {workoutPlan.currentDay} of 7</p>
            </div>
          </div>

          {/* Week Progress */}
          <div className="flex gap-4 overflow-x-auto pb-2 min-w-full">
            {workoutPlan.progress.map((week) => (
              <Button
                key={week.week}
                variant={week.status === "in-progress" ? "default" : "outline"}
                className="min-w-[100px]"
              >
                Week {week.week}
                <br />
                <span className="text-xs">
                  {week.status === "completed"
                    ? "Completed"
                    : week.status === "in-progress"
                      ? "In Progress"
                      : "Upcoming"}
                </span>
              </Button>
            ))}
          </div>

          {/* Daily Workouts */}
        

 <div className="grid gap-4 md:grid-cols-4">
  {/* {workoutPlan.progress[2].days.map((day) => {
    const dayExercises = exerciseData[day.day] || [];
    const completedExercisesCount = completedExercisesByDay[day.day]?.size || 0;
    const allExercisesCompleted = dayExercises.length > 0 && completedExercisesCount === dayExercises.length;

    return (
      <Card key={day.day} onClick={() => handleDayClick(day)} className={allExercisesCompleted ? "border-green-500" : "border-primary"}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold">Day {day.day} </h3>
              <p className="text-sm text-muted-foreground">{day.type}</p>
            </div>
            {allExercisesCompleted ? <Check className="text-green-500" /> : <Clock className="text-blue-500" />}
              console.log("Day:", day.day, "Exercises:", dayExercises, "Completed:", completedExercisesByDay[day.day]);  

          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>{day.exercises} exercises</p>
            <p>{day.duration} minutes</p>
          </div>
        </CardContent>
      </Card>
    );
  })} */}
  {workoutPlan.progress[0].days.map((day) => {
  const dayExercises = exerciseData[day.day] || [];
  const completedExercisesCount = completedExercisesByDay[day.day]?.size || 0;
  const allExercisesCompleted = dayExercises.length > 0 && completedExercisesCount === dayExercises.length;
    


  return (
    <Card key={day.day} onClick={() => handleDayClick(day)} className={allExercisesCompleted ? "border-green-500" : "border-primary"}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold">Day {day.day}</h3>
            <p className="text-sm text-muted-foreground">{day.type}</p>
          </div>
          {/* {allExercisesCompleted ? <Check className="text-green-500" /> : <Clock className="text-blue-500" />} */}
          {isDayCompleted(day) ? (
  <Check className="text-green-500" />
) : (
  <Clock className="text-blue-500" />
)}
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>{dayExercises.length} exercises</p>
        </div>
      </CardContent>
    </Card>
  );
})}

</div> 


    {/* Today's Workout (Now updates based on selected day) */}
    <div>
            <h2 className="text-xl font-semibold mb-4">Today's Workout</h2>
            <div className="space-y-4">
              {selectedDayExercises.map((exercise) => (
                <Card key={exercise.id} className={completedExercises.has(exercise.id) ? "bg-muted" : ""}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="h-20 w-20 rounded-md bg-muted">{/* Exercise image would go here */}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{exercise.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {exercise.sets} sets × {exercise.reps} reps
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => toggleExercise(exercise.id)}>
                            {completedExercises.has(exercise.id) ? "Undo" : "Complete"}
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
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Start Workout
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}




