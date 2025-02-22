import { connectDB } from "@/db";
import { MealPlan } from "@/models/meal.model";
import { MealPreference } from "@/models/mealpreference.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    console.error("Missing GEMINI_API_KEY in environment variables");
    throw new Error("Missing GEMINI_API_KEY in environment variables");
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  // ✅ Updated prompt for structured response
  const promptmeal = `
Generate a structured meal prep plan for ${duration} days based on the user's inputs. Ensure the diet plan aligns with their **fitness and health goals**, taking into account meal preferences, dietary restrictions, and workout intensity.

### **User Inputs:**
- **Caloric Intake Goal:** ${caloricIntakeGoal}
- **Meal Count Preference:** ${mealCountPreference}
- **Dietary Restrictions:** ${
    dietaryRestrictions ? dietaryRestrictions : "None"
  }
  **bmi:**${bmi}
  **height:**${height}
  **weight:**${weight}
- **Allergies:** ${allergies ? allergies : "None"}
- **Goal:** ${goal}
---
- **Meal Type:** enum: [
            'Early Morning', 'Breakfast', 'Mid-Morning Snack', 'Lunch',
            'Afternoon Snack', 'Pre-Workout Meal', 'Post-Workout Meal', 'Dinner'
        ] -> choose the meals based on the meal count preference
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
            "protein": "Protein content (g)",
            "carbs": "Carbohydrate content (g)",
            "fats": "Fat content (g)",
            "calories": "Calories per serving"
          }
        }
      ],
      "totalCalories": "Total calories for the day",
      "totalProtein": "Total protein intake (g)",
      "totalCarbs": "Total carbohydrate intake (g)",
      "totalFats": "Total fat intake (g)"
    }
  ]
}
\`\`\`

### Requirements:
-- Should complete the json and provide all the items in the json it is required.
-- Don't keep the json empty generate the full json with all the parenthesis matching ie a starting bracket should have an ending one.

### **Guidelines:**
- Ensure **meal selection aligns with dietary preferences, allergies, and restrictions**.
- The meal plan should **support the user's fitness goals** (e.g., high protein for muscle gain, calorie deficit for weight loss).
- Consider **workout intensity and session length** to adjust meal portion sizes and macros accordingly.
- Return only a valid JSON response with no additional text.
`;
  // Call Gemini API
  const generatedContent = await model.generateContent(promptmeal);
  const responseText = await generatedContent.response.text();
  // console.log(responseText);

  // Ensure it's valid JSON
  const jsonResponse = JSON.parse(
    responseText
      .replace(/```json/g, "") // Remove ```json if present
      .replace(/```/g, "") // Remove closing ```
      .trim()
  );
  
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