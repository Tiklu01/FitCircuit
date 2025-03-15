/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from "@/db";
import { MealPlan } from "@/models/meal.model";
import { MealPreference } from "@/models/mealpreference.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });

export async function POST(req: NextRequest) {
  await connectDB(); // Ensure MongoDB is connected
  const authObject = getAuth(req); // ✅ Use `getAuth` directly inside API route
  console.log(authObject.userId);
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
  const { mealPreference } = reqBody;
  const {
    goal,
    caloricIntakeGoal,
    mealCountPreference,
    dietaryRestrictions,
    allergies,
    bmi, 
    height,
    weight,
    age
  } = mealPreference;

  const mealPreferenceData = {
    userId: user._id,
    goal,
    caloricIntakeGoal,
    mealCountPreference,
    dietaryRestrictions,
    allergies,
    bmi,
    height,
    weight,
    age
};
  const updatedMealPreference = await MealPreference.findOneAndUpdate(
    { userId: user._id }, // Filter to find the document
    mealPreferenceData,   // Data to update or insert
    { upsert: true, new: true } // Options: upsert to create if not exists, new to return the updated document
);

if (!updatedMealPreference) {
    return NextResponse.json({ message: "Meal preference update failed" }, { status: 500 });
}

  const duration = 7; // Default duration for meal plan

  // ✅ Updated prompt for structured response
  const promptMeal = `
  Generate a *complete* structured meal prep plan for ${duration} days based on the user's inputs. Ensure the diet plan aligns with their **fitness and health goals**, taking into account meal preferences, dietary restrictions, and workout intensity.
  ### **Requirements:**
  - Ensure **meal selection aligns with dietary preferences, allergies, and restrictions**.
  - The meal plan should **support the user's fitness goals** (e.g., high protein for muscle gain, calorie deficit for weight loss).
  - Return only a valid JSON response with no additional text.
  - The entire meal plan must be returned in one response; do not truncate.
  - Use concise descriptions to fit within the response limit.
  - Give the protien, carbs, fats, calories, totalCalories, totalProtein, totalCarbs, totalFats for each meal in numbers don't use words.
  
  ### **User Inputs:**
  - **Caloric Intake Goal:** ${caloricIntakeGoal}
  - **Meal Count Preference:** ${mealCountPreference}
  - **Dietary Restrictions:** ${dietaryRestrictions ? dietaryRestrictions : "None"}
  - **Allergies:** ${allergies ? allergies : "None"}
  - **Goal:** ${goal}
  - **BMI:** ${bmi}
  - **Height:** ${height} cm
  - **Weight:** ${weight} kg
  - **Age:** ${age} years
  
  ### **Meal Types:**
  Choose meals based on the meal count preference from the following list:
  - Early Morning
  - Breakfast
  - Mid-Morning Snack
  - Lunch
  - Afternoon Snack
  - Pre-Workout Meal
  - Post-Workout Meal
  - Dinner
  
  ### **Output Format:**
  Return the meal prep plan in **JSON format** with the following structure:
  
  \`\`\`json
  {
    "days": [
      {
        "day": 1,
        "meals": [
          {
            "type": "Meal Type",
            "name": "Meal Name",
            "description": "Short description of the meal",
            "nutritionalValues": { 
              "protein": "Protein content",
              "carbs": "Carbohydrate content",
              "fats": "Fat content",
              "calories": "Calories per serving"
            }
          }
        ],
        "totalCalories": "Total calories for the day",
        "totalProtein": "Total protein intake",
        "totalCarbs": "Total carbohydrate intake",
        "totalFats": "Total fat intake"
      }
    ]
  }
  \`\`\`
  
  
  ### **Guidelines:**
  - Ensure the meal plan is **complete** and covers all specified days.
  - Include **all necessary details** in the JSON structure.
  - Ensure the JSON is **valid** with all opening and closing brackets properly matched.
  `;
  
  const chatResponse = await client.chat.complete({
        model: "mistral-large-latest",
        messages: [{ role: "user", content: promptMeal }],
        maxTokens: 18000,
      });
  
      if(!chatResponse) {
        return NextResponse.json({ message: "Failed to generate meal plan" }, { status: 500 });
      }
  
      const responseText = chatResponse?.choices?.[0]?.message?.content;
      if (!responseText) {
        return NextResponse.json({ message: "Failed to generate meal plan" }, { status: 500 });
      }
      console.log(responseText);
  
  // Ensure it's valid JSON
  const jsonResponse = JSON.parse((responseText as string)?.replace(/```json|```/g, "").trim());
  console.log(jsonResponse);
  
  // Create a new meal plan or update the existing one
  let mealPlan = await MealPlan.findOne({ userId: user._id });

  if (!mealPlan) {
    mealPlan = new MealPlan({ userId: user._id, days: [] });
  }

  // Update the days with the new meal data 
  jsonResponse.days.forEach((dayData: any) => {
    const dayIndex = mealPlan.days.findIndex((d: any) => d.day === dayData.day);
    if (dayIndex === -1) {
      mealPlan.days.push(dayData);
    } else {
      mealPlan.days[dayIndex] = dayData;
    }
  });
  await mealPlan.save();
  if (!jsonResponse || !mealPlan) {
    return NextResponse.json(
      { message: "Meal plan generation failed" },
      { status: 500 }
    );
  }
  return NextResponse.json({ jsonResponse , message: "Meal plan generated successfully" }, { status: 200 });
}