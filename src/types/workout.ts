export type WorkoutStatus = "completed" | "in-progress" | "upcoming"


// export type Exercise = {
//   id: string;
//   name: string;
//   instructions: string;
//   description?: string;
//   sets: number;
//   reps?: number;
//   time?: string;
//   restTime?: string;
//   image?: string;
//   equipment: string[];
//   muscleGroup: string[];
// };

// export type WorkoutDay = {
//   day: number;
//   type: string;
//   exercisesCount: number;
//   // exercises: Exercise[];  // Ensure Exercise type exists
//   duration: number;
//   workouts: Exercise[];
//   status: "completed" | "in-progress" | "upcoming";
// };

type Exercise = {
  name: string;
  instructions: string;
  description: string;
  sets: number;
  reps: number;
  time: string;
  restTime: string;
  image: string;
  equipment: string[];
  muscleGroup: string[];
};
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


// export interface WorkoutPlan {
//   currentWeek: number
//   currentDay: number
//   streak: number
//   totalWorkouts: number
//   progress: WeekProgress[]
// }

export type WeekWorkout = {
  week: number;
  days: DayWorkout[];
  status: 'pending' | 'completed';
};


export type WorkoutPlan = {
  userId: string;
  weeks: WeekWorkout[];
  currentWeek: number;
  currentDay: number;
  streak: number;
  totalWorkouts: number;
};

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







