import { connectDB } from "@/db";
import { MealPlan } from "@/models/meal.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  await connectDB(); // Ensure MongoDB is connected
  const authObject = getAuth(req); // ✅ Use `getAuth` directly inside API route
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
  const mealPlan = await MealPlan.findOne({ userId: user._id });
  if (!mealPlan) {
    return NextResponse.json(
      { message: "Meal plan not found" },
      { status: 404 }
    );
  } 
  return NextResponse.json(
    { mealPlan: mealPlan.days , message: "Meal plan retrieved successfully" },
    { status: 200 }
  );
}

