export type WorkoutStatus = "completed" | "in-progress" | "upcoming"

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: number
  muscles: string[]
  imageUrl: string

}

export type WorkoutDay = {
  day: number;
  type: string;
  exercises: Exercise[];  // Ensure Exercise type exists
  duration: number;
  status: "completed" | "in-progress" | "upcoming";
};


// export interface DayWorkout {
//   day: number
//   type: string
//   exercises: number
//   duration: number
//   status: WorkoutStatus
// }

export interface DayWorkout {
  day: number
  type: string
  exercises: number
  duration: number
  status: "completed" | "in-progress" | "upcoming"
}

export interface WeekProgress {
  week: number
  status: WorkoutStatus
  days: DayWorkout[]
}

export interface WeekProgress {
  week: number
  status: "completed" | "in-progress" | "upcoming"
  days: DayWorkout[]
}


export interface WorkoutPlan {
  currentWeek: number
  currentDay: number
  streak: number
  totalWorkouts: number
  progress: WeekProgress[]
}



export interface WorkoutPreferences {
  goal: string
  eventName?: string
  height: number
  weight: number
  programDuration: string
  equipment: string[]
  sessionLength: number
  weeklyFrequency: string
  noRestDays: boolean
  intensityLevel: "beginner" | "intermediate" | "advanced"
  healthConsiderations: string[]
  additionalDetails: string
}







