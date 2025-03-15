/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db";
import { WorkoutPlan } from "@/models/workout.model";
import { User } from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";

export async function PATCH(req: NextRequest) {
  await connectDB();

  try {
    // Parse and validate request body
    const { weekNumber, dayNumber, status } = await req.json();

    if (!weekNumber || !dayNumber || !status) {
      return NextResponse.json(
        { message: "Missing required fields: weekNumber, dayNumber, and status" },
        { status: 400 }
      );
    }

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

    if (!["pending", "completed"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value. Allowed values are 'pending' or 'completed'" },
        { status: 400 }
      );
    }

    // Locate the week by week number
    const week = workoutPlan.weeks.find((w: any) => w.week === weekNumber);
    if (!week) {
      return NextResponse.json({ message: "Week not found in workout plan" }, { status: 404 });
    }

    // Locate the day within the week by day number
    const day = week.days.find((d: any) => d.day === dayNumber);
    if (!day) {
      return NextResponse.json({ message: "Day not found in week" }, { status: 404 });
    }

    // Update the day status
    day.status = status;

    // Update week status based on the status of all days
    week.status = week.days.every((d: any) => d.status === "completed") ? "completed" : "pending";

    // Save the updated workout plan document
    await workoutPlan.save();

    return NextResponse.json(
      {
        message: "Day status updated successfully",
        data: {
          weekNumber,
          dayNumber,
          dayStatus: day.status,
          weekStatus: week.status,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating day status:", error);
    return NextResponse.json(
      { message: "Error updating day status", error: error.message },
      { status: 500 }
    );
  }
}