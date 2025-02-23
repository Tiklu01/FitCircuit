/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import type { NextRequest } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Function to convert image buffer to base64
function fileToGenerativePart(buffer: Buffer, mimeType: string) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      console.error("No file uploaded")
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }
    const portion = formData.get("portion") as string | null
    console.log(portion)

    const buffer = await file.arrayBuffer()
    const base64Image = Buffer.from(buffer).toString("base64")
    const dataURI = `data:${file.type};base64,${base64Image}`

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(dataURI, { folder: "food_analysis" }, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      })
    })

    const imageUrl = (result as any).secure_url

    // ✅ Ensure API key exists before proceeding
    const API_KEY = process.env.GEMINI_API_KEY
    if (!API_KEY) {
      console.error("Missing GEMINI_API_KEY in environment variables")
      throw new Error("Missing GEMINI_API_KEY in environment variables")
    }

    const genAI = new GoogleGenerativeAI(API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    // ✅ Updated prompt for structured response
    const prompt = `Analyze the provided image and identify all food items present. Consider the portion information if provided and calculate the total macros accordingly.

    - If the image does not contain food, return: {"food": "None"}
    - If food is detected, return a JSON object with the following structure:
    {
        "food_identification": [
            {
                "item": "Food name",
                "estimated_weight": "Estimated weight in grams"
            }
        ],
        "nutritional_information": {
            "calories": "Total calories of the servings or according to the portion or weight if provided",
            "protein": "Total protein content of the servings or according to the portion or weight if provided",
            "carbohydrates": "Total carbohydrate content of the servings or according to the portion or weight if provided",
            "fats": "Total fat content of the servings or according to the portion or weight if provided"
        },
        "recipe": {
            "name": "Recipe Name",
            "ingredients": [
                {
                    "name": "Ingredient name",
                    "quantity": "Amount needed"
                }
            ],
            "instructions": [
                "Step 1: Description of the step",
                "Step 2: Description of the step",
                "Step 3: Description of the step"
            ],
            "prep_time": "Estimated preparation time",
            "cook_time": "Estimated cooking time",
            "servings": "Number of servings"
        }
    }

    Ensure that:
    - The **food identification** provides an accurate name and estimated weight.
    - The **ingredients** include key components of the dish.
    - The **nutritional information** is relevant and correct, considering the portion information.
    - The **recipe** provides clear step-by-step cooking instructions.
    - Return **only a valid JSON response** with no extra text.

    Portion information: ${portion ? portion : "Not provided"}`

    const imageBuffer = Buffer.from(buffer)
    const imagePart = fileToGenerativePart(imageBuffer, file.type)

    // ✅ Call Gemini API with error handling
    const generatedContent = await model.generateContent([prompt, imagePart])
    console.log("Gemini API response received")

    const responseText = await generatedContent.response.text()
    const jsonResponse = JSON.parse(responseText.replace(/```json|```/g, "").trim())
    console.log("Parsed JSON response: ", jsonResponse)

    return NextResponse.json({ jsonResponse, imagePart: imageUrl }, { status: 200 })
  } catch (error) {
    console.error("Upload Route Error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
