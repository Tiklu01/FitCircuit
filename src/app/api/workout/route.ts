import { connectDB } from "@/db";
import { WorkoutPlan } from "@/models/workout.model";
import { WorkoutPreference } from "@/models/workoutpreference.model";
import { User } from "@/models/user.model";
import { Image } from "@/models/image.model";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { Mistral } from "@mistralai/mistralai";


const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });

interface Exercise {
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
}

interface Day {
  day: number;
  exercises: Exercise[];
  status: string;
}

interface Week {
  week: number;
  days: Day[];
  status: string;
}

interface WorkoutPlanResponse {
  weeks: Week[];
}


export async function POST(req: NextRequest) {
  await connectDB();
  const authObject = getAuth(req);
  if (!authObject.userId) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }
  const user = await User.findOne({ clerkUserId: authObject.userId });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const reqBody = await req.json();
  const { workoutPreference } = reqBody;
  console.log(workoutPreference);

  // Save or update workout preference
  const updatedWorkoutPreference = await WorkoutPreference.findOneAndUpdate(
    { userId: user._id },
    { ...workoutPreference, userId: user._id },
    { upsert: true, new: true }
  );

  if (!updatedWorkoutPreference) {
    return NextResponse.json({ message: "Failed to save workout preference" }, { status: 500 });
  }

  const {
    trainingGoal,
    trainingType,
    daysPerWeek,
    desiredResults,
    fitnessLevel,
    availableEquipment = [],
    workoutDuration,
    weeks,
    physicalCondition,
  } = workoutPreference;

  const exerciseList = [
    "Push-ups",
    "Squats",
    "Lunges",
    "Burpees",
    "Plank",
    "Jumping Jacks",
    "Mountain Climbers",
    "Sit-ups",
    "Bicycle Crunches",
    "Wall Sit",
    "Triceps Dips (using a bench)",
    "Calf Raises",
    "Glute Bridges",
    "Superman Hold",
    "Side Plank",
    "Flutter Kicks",
    "High Knees",
    "Bear Crawl",
    "Donkey Kicks",
    "Step-ups",
    "Dumbbell Bench Press",
    "Dumbbell Shoulder Press",
    "Dumbbell Bicep Curls",
    "Dumbbell Triceps Kickback",
    "Dumbbell Deadlift",
    "Dumbbell Goblet Squat",
    "Dumbbell Bent-over Row",
    "Dumbbell Lateral Raises",
    "Dumbbell Front Raises",
    "Dumbbell Hammer Curls",
    "Dumbbell Shrugs",
    "Dumbbell Bulgarian Split Squats",
    "Dumbbell Farmers Walk",
    "Dumbbell Reverse Fly",
    "Dumbbell Romanian Deadlift",
    "Dumbbell Chest Fly",
    "Dumbbell Step-ups",
    "Dumbbell Clean and Press",
    "Dumbbell Overhead Triceps Extension",
    "Dumbbell Side Lunge",
    "Barbell Back Squat",
    "Barbell Deadlift",
    "Barbell Bench Press",
    "Barbell Overhead Press",
    "Barbell Bent-over Row",
    "Barbell Front Squat",
    "Barbell Romanian Deadlift",
    "Barbell Hip Thrust",
    "Barbell Clean and Jerk",
    "Barbell Snatch",
    "Kettlebell Swings",
    "Kettlebell Goblet Squat",
    "Kettlebell Deadlift",
    "Kettlebell Turkish Get-up",
    "Kettlebell Clean and Press",
    "Kettlebell Snatch",
    "Kettlebell Windmill",
    "Kettlebell Row",
    "Kettlebell Front Rack Squat",
    "Kettlebell Lunges",
    "Resistance Band Squats",
    "Resistance Band Deadlifts",
    "Resistance Band Shoulder Press",
    "Resistance Band Lateral Walks",
    "Resistance Band Bicep Curls",
    "Resistance Band Triceps Extensions",
    "Resistance Band Rows",
    "Resistance Band Chest Press",
    "Resistance Band Kickbacks",
    "Resistance Band Face Pulls",
    "Lat Pulldown",
    "Seated Row Machine",
    "Leg Press",
    "Leg Curl Machine",
    "Leg Extension Machine",
    "Pec Deck Machine",
    "Cable Chest Fly",
    "Cable Triceps Pushdown",
    "Cable Bicep Curls",
    "Cable Lateral Raises",
    "Treadmill Running",
    "Rowing Machine",
    "Jump Rope",
    "Stair Climber",
    "Battle Ropes",
    "Assault Bike",
    "Sled Push",
    "Agility Ladder Drills",
    "Box Jumps",
    "Sprint Intervals",
    "Russian Twists",
    "Hanging Leg Raises",
    "Cable Woodchopper",
    "Medicine Ball Slams",
    "Dead Bug Exercise",
    "Hollow Body Hold",
    "V-Ups",
    "Side-to-Side Plank Twists",
    "Standing Oblique Crunches",
    "Hanging Knee Tucks",
  ];

  const promptWorkout = `
  Generate a *complete* structured workout plan for ${daysPerWeek} days per week over ${weeks} weeks.

  ### Requirements:
  - *Each day of every week must be included* in the response.
  - *Exercises MUST be chosen only from the predefined list below.*
  - The plan should align with the user’s *fitness level, training goal, and available equipment*.
  - The *entire workout plan must be returned in one response*, do not truncate.
  - Use *concise descriptions* to fit within the response limit.

  ---

  ### User Inputs:
  - *Training Goal:* ${trainingGoal}
  - *Training Type:* ${trainingType}
  - *Desired Results:* ${desiredResults}
  - *Fitness Level:* ${fitnessLevel}
  - *Available Equipment:* ${availableEquipment.length > 0 ? availableEquipment.join(", ") : "None"}
  - *Workout Duration Per Day:* ${workoutDuration}
  - *Number of Weeks:* ${weeks}
  - *Physical Condition or Limitations:* ${physicalCondition ? physicalCondition : "None"}

  ---

  ### Exercise List (Select from below only):
  ${exerciseList.map(exercise => `- ${exercise}`).join('\n')}

  ---

  ### Output Format (Valid JSON covering ALL weeks & days):
  \`\`\`json
  {
      "weeks": [
          {
              "week": 1,
              "days": [
                  {
                      "day": 1,
                      "exercises": [
                          {
                              "name": "Exercise Name (from the list above)",
                              "instructions": "Step-by-step instructions.",
                              "description": "Brief explanation.",
                              "sets": 3,
                              "reps": 12,
                              "restTime": "45 sec",
                              "equipment": ["Dumbbells"],
                              "muscleGroup": ["Chest", "Triceps"]
                          }
                      ],
                      "status": "pending"
                  }
                  // Repeat for all days
              ]
          }
          // Repeat for all weeks
      ]
  }
  \`\`\`
  `;

  try {
    // Call Mistral API
    const chatResponse = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [{ role: "user", content: promptWorkout }],
      maxTokens: 20000,
    });

    if(!chatResponse) {
      return NextResponse.json({ message: "Failed to generate workout plan" }, { status: 500 });
    }

    const responseText = chatResponse?.choices?.[0]?.message?.content;
    if (!responseText) {
      return NextResponse.json({ message: "Failed to generate workout plan" }, { status: 500 });
    }
    console.log(responseText);

    // Ensure it's valid JSON
    const jsonResponse: WorkoutPlanResponse = JSON.parse((responseText as string)?.replace(/```json|```/g, "").trim());
    console.log(jsonResponse);

    // Fetch images for the exercises in the generated workout plan
    const exerciseNames = jsonResponse.weeks.flatMap(week =>
      week.days.flatMap(day => day.exercises.map(exercise => exercise.name))
    );

    const images = await Image.find({ name: { $in: exerciseNames } });
    const imageMap = images.reduce((acc: Record<string, string>, image) => {
      acc[image.name] = image.url;
      return acc;
    }, {});

    // Integrate images into the workout plan
    jsonResponse.weeks.forEach(week => {
      week.days.forEach(day => {
        day.exercises.forEach(exercise => {
          exercise.image = imageMap[exercise.name] || "";
        });
      });
    });

    // Save or update the workout plan
    const updatedWorkoutPlan = await WorkoutPlan.findOneAndUpdate(
      { userId: user._id },
      { weeks: jsonResponse.weeks },
      { upsert: true, new: true }
    );

    if (!updatedWorkoutPlan) {
      return NextResponse.json({ message: "Failed to save or update workout plan" }, { status: 500 });
    }
    console.log(updatedWorkoutPlan);

    return NextResponse.json({ jsonResponse }, { status: 200 });
  } catch (error) {
    console.error("Error generating workout plan:", error);
    return NextResponse.json({ error: "Failed to generate workout plan" }, { status: 500 });
  }
}
