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
    restrictions,
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
    restrictions,
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
Create a **personalized meal plan** for ${duration} days, considering the user's **BMI, weight, height, dietary restrictions, and fitness goals**. The plan should guide them on how their meals contribute to achieving their target (weight loss, muscle gain, or maintenance).

### *Requirements:*
-- Should complete the json and provide all the items in the json it is required
-- Don't keep the json empty generate the full json

### **User Profile:**
- **Current Weight:** ${weight} kg
- **Height:** ${height} cm
- **BMI:** ${bmi}
- **Fitness Goal:** ${goal} (e.g., weight loss, muscle gain, maintenance)
- **Meal Count Per Day:** ${mealCountPreference}
- **Dietary Restrictions (Includes Allergies):** ${
    restrictions ? restrictions : "None"
  }

---

### **Meal Plan Output Format:**
Generate a structured **JSON response** with the following format:

\`\`\`json
{
  "days": [
    {
      "day": 1,
      "total_calories": "Calories to consume today based on goal",
      "caloric_breakdown": {
        "protein": "Target protein intake (g)",
        "carbohydrates": "Target carbohydrate intake (g)",
        "fats": "Target fat intake (g)"
      },
      "meals": [
        {
          "meal_type": "Meal Type (Breakfast, Lunch, etc.)",
          "name": "Meal Name",
          "ingredients": [
            {
              "name": "Ingredient Name",
              "quantity": "Amount (grams, cups, etc.)"
            }
          ],
          "instructions": "Step-by-step cooking instructions",
          "prep_time": "Preparation Time",
          "cook_time": "Cooking Time",
          "calories_per_meal": "Calories per serving",
          "macros": {
            "protein": "Protein content (g)",
            "carbohydrates": "Carbohydrate content (g)",
            "fats": "Fat content (g)"
          },
          "benefit": "How this meal helps user achieve their goal"
        }
      ],
      "daily_guidance": "Tips on how this day's meal plan helps achieve the goal"
    }
  ]
}
\`\`\`

---

### **Guidelines for Meal Plan Generation:**
1. **Caloric Intake Calculation:**  
   - If the goal is **weight loss**, recommend a slight **caloric deficit** based on BMI.  
   - If the goal is **muscle gain**, suggest a **caloric surplus** with **higher protein intake**.  
   - If the goal is **maintenance**, balance macronutrients accordingly.

2. **Meal Selection:**  
   - Ensure meals align with the **user’s dietary restrictions** (including allergies).  
   - Suggest meals with **balanced macronutrients** to optimize fitness results.

3. **Daily Guidance:**  
   - Provide brief explanations on **why each meal is chosen** and **how it helps the user reach their goal**.  
   - If the user aims for **weight loss**, explain how the meal keeps them in a deficit while maintaining energy.  
   - If the goal is **muscle gain**, indicate how the meal supports muscle recovery and growth.

4. **Step-by-step Meal Prep:**  
   - Include detailed **cooking instructions** for each meal.  
   - Provide **prep time & cook time** to help with planning.  

---

### **Output Requirements:**
- Return **only** the structured JSON response.
- Do **not** include extra explanations or text outside the JSON.
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