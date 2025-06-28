// src/app/api/ai/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  parseNaturalLanguageRule,
  suggestDataCorrections,
} from "@/lib/ai/aiService";

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    switch (action) {
      case "parseRule":
        const rule = await parseNaturalLanguageRule(data.input);
        return NextResponse.json({ rule });

      case "suggestCorrections":
        const suggestions = await suggestDataCorrections(data.items, data.type);
        return NextResponse.json({ suggestions });

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "AI processing failed" },
      { status: 500 }
    );
  }
}
