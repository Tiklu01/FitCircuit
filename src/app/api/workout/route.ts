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
  caloriesBurned: number;
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

export async function GET(req: NextRequest) {
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
  const workoutPlan = await WorkoutPlan.findOne({ userId: user._id });
  if (!workoutPlan) {   
    return NextResponse.json({ message: "Workout plan not found" }, { status: 404 });
  }
  return NextResponse.json({ workoutPlan: workoutPlan.weeks }, { status: 200 });
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
        goal,
        eventName,
        bodyMetrics,
        programDuration,
        equipment,
        sessionLength,
        weeklyFrequency,
        noRestDays,
        intensityLevel,
        healthConsiderations,
        additionalDetails,
  } = workoutPreference;

  const exerciseList = [
    "Push-ups",
    "Squats",
    "Lunges",
    "Plank",
    "Burpees",
    "Deadlifts",
    "Bench Press",
    "Pull-ups",
    "Overhead Press",
    "Rows",
    "Bicep Curls",
    "Tricep Dips",
    "Leg Press",
    "Calf Raises",
    "Lat Pulldowns",
    "Hammer Curls",
    "Shoulder Shrugs",
    "Leg Curls",
    "Chest Flyes",
    "Front Squats",
    "Glute Bridges",
    "Tricep Extensions",
    "Hanging Leg Raises",
    "Side Planks",
    "Russian Twists",
    "Mountain Climbers",
    "Jumping Jacks",
    "High Knees",
    "Box Jumps",
    "Battle Ropes",
    "Kettlebell Swings",
    "Goblet Squats",
    "Step-ups",
    "Walking Lunges",
    "Split Squats",
    "Bulgarian Split Squats",
    "Calf Raise Variations",
    "Hamstring Curls",
    "Leg Extensions",
    "Hip Thrusts",
    "Glute Kickbacks",
    "Donkey Kicks",
    "Fire Hydrants",
    "Reverse Crunches",
    "Bicycle Crunches",
    "Leg Raises",
    "Flutter Kicks",
    "Scissor Kicks",
    "Reverse Plank",
    "Side Crunches",
    "Oblique Crunches",
    "Hanging Knee Raises",
    "Toe Touches",
    "Reverse Hyperextensions",
    "Good Mornings",
    "Hip Circles",
    "Hip Flexor Stretch",
    "Hamstring Stretch",
    "Quad Stretch",
    "Chest Stretch",
    "Shoulder Stretch",
    "Tricep Stretch",
    "Bicep Stretch",
    "Forearm Stretch",
    "Wrist Stretch",
    "Neck Stretch",
    "Cat-Cow Stretch",
    "Downward Dog",
    "Upward Dog",
    "Cobra Stretch",
    "Child's Pose",
    "Pigeon Pose",
    "Warrior Pose",
    "Triangle Pose",
    "Tree Pose",
    "Eagle Pose",
    "Chair Pose",
    "Bridge Pose",
    "Wheel Pose",
    "Fish Pose",
    "Boat Pose",
    "Crow Pose",
    "Headstand",
    "Handstand",
    "Forearm Stand",
    "Side Plank Variations",
    "Reverse Flyes",
    "Face Pulls",
    "Rear Delt Flyes",
    "Front Raises",
    "Lateral Raises",
    "Shrugs",
    "Upright Rows",
    "Close-Grip Bench Press",
    "Incline Bench Press",
    "Decline Bench Press",
    "Floor Press",
    "Dumbbell Flyes",
    "Cable Flyes",
    "Pushdowns",
    "Skull Crushers",
    "Overhead Extensions",
    "Dips",
    "Close-Grip Push-ups",
    "Concentration Curls",
    "Preacher Curls",
    "Drag Curls",
    "Zottman Curls",
    "Barbell Curls",
    "EZ Bar Curls",
    "Resistance Band Curls",
    "Cable Curls",
    "Incline Curls",
    "Decline Curls",
    "Hammer Strength Curls",
    "Seated Curls",
    "Standing Curls",
    "Kneeling Curls",
    "Lying Curls"
];


const promptWorkout = `
Generate a *complete* structured workout plan for ${weeklyFrequency} days per week over ${programDuration} weeks.

### Requirements:
- *Each day of weeklyFrequence given must be included* in the response.
- *Exercises MUST be chosen only from the predefined list below.*
- The plan should align with the user’s *fitness level, training goal, and available equipment*.
- The *entire workout plan must be returned in one response*, do not truncate.
- Use *concise descriptions* to fit within the response limit.
- Consider the user's *intensity level* and *health considerations*.
- Include *no rest days* if specified.
- Adjust the *session length* and *equipment* as per user input.
- Make an estimaed guess on the *calories burned* for each exercise.
---

### User Inputs:
- *Training Goal:* ${goal}
- *Training Type:* ${eventName}
- *Body Metrics:* Height: ${bodyMetrics.height} cm, Weight: ${bodyMetrics.weight} kg
- *Program Duration:* ${programDuration} weeks
- *Equipment Available:* ${equipment.length > 0 ? equipment.join(", ") : "None"}
- *Session Length:* ${sessionLength} minutes
- *Weekly Frequency:* ${weeklyFrequency} days per week
- *No Rest Days:* ${noRestDays ? "Yes" : "No"}
- *Intensity Level:* ${intensityLevel}
- *Health Considerations:* ${healthConsiderations.length > 0 ? healthConsiderations.join(", ") : "None"}
- *Additional Details:* ${additionalDetails}
- *Physical Condition or Limitations:* ${healthConsiderations.length > 0 ? healthConsiderations.join(", ") : "None"}

---

### Exercise List (Select from below only):
${exerciseList.map(exercise => `- ${exercise}`).join('\n')}

---

### Output Format (Valid JSON covering ALL weeks & days):
Return the structured workout plan in JSON format following this structure:

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
                            "name": "Exercise Name",
                            "instructions": "Step-by-step instructions on how to perform the exercise correctly.",
                            "description": "Brief description of the exercise and its benefits.",
                            "sets": 3,
                            "reps": 12,
                            "time": "30 sec",
                            "restTime": "45 sec",
                            "image": "",
                            "equipment": ["Dumbbells"],
                            "muscleGroup": ["Chest", "Triceps"],
                            "caloriesBurned": 100
                        }
                    ],
                    "status": "pending"
                }
            ],
            "status": "pending"
        }
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
