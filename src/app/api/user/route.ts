import { connectDB } from "@/db";
import { User } from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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
    return NextResponse.json(
      { user: user, message: "User retrieved successfully" },
        { status: 200 }
    );
}