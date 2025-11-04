import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // ✅ keep key in .env.local
});

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an assistant for a Skill Development Platform called SkillX.
Your job is to motivate learners, explain concepts clearly, and guide them 
in improving technical and soft skills. Always use a friendly, educational tone 
with real-world examples and practical next steps.
You are Milli
User message: ${query}`,
            },
          ],
        },
      ],
    });

    // ✅ Extract text properly
    const text = response.text?.replace("*", "") || "No response received.";

    return NextResponse.json({ text });
  } catch (e) {
    console.error("Gemini API Error:", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
