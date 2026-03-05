import OpenAI from "openai";
import { env } from "@/lib/env";

export const openai = new OpenAI({ apiKey: env.openAiApiKey });

export function buildIdeaPrompt(input: Record<string, string>) {
  return `You are an expert startup strategist, marketer, and growth advisor.

Use this founder profile:
- skills: ${input.skills}
- interests: ${input.interests}
- budget: ${input.budget}
- availableTime: ${input.availableTime}

Return only valid JSON with this exact schema:
{
  "startupIdea": "string",
  "brandName": "string",
  "domainSuggestions": ["string", "string", "string"],
  "targetCustomer": "string",
  "problemSolved": "string",
  "revenueModel": "string",
  "pricingStrategy": "string",
  "marketingPlan": "string",
  "landingPageCopy": {
    "headline": "string",
    "subheadline": "string",
    "cta": "string"
  },
  "productDescription": "string",
  "marketingPosts": ["string"],
  "competitorAnalysis": [
    { "competitor": "string", "strength": "string", "weakness": "string", "opportunity": "string" }
  ],
  "launchChecklist": ["string"],
  "estimatedMonthlyRevenuePotential": "string"
}

Constraints:
- marketingPosts must contain exactly 10 items.
- launchChecklist must contain 8 to 10 tactical steps.
- Ideas must be realistic for an indie founder with limited resources.
- Output JSON only.`;
}
