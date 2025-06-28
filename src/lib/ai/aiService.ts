// src/lib/ai/aiService.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true, // Only for demo - use API routes in production
});

export async function parseNaturalLanguageRule(input: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a rule parser for a resource allocation system. Parse natural language into structured rules.
          Rule types: co-run, slot-restriction, load-limit, phase-window, pattern-match, precedence.
          Return JSON with: type, config object, and description.`,
        },
        {
          role: "user",
          content: input,
        },
      ],
      temperature: 0.3, // src/lib/ai/aiService.ts (continued)
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("AI parsing error:", error);
    return null;
  }
}

export async function suggestDataCorrections(data: any[], type: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Analyze ${type} data and suggest corrections for common issues like formatting, missing values, or logical inconsistencies.`,
        },
        {
          role: "user",
          content: JSON.stringify(data.slice(0, 5)), // Sample data
        },
      ],
      temperature: 0.3,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("AI suggestion error:", error);
    return null;
  }
}
