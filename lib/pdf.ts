import PDFDocument from "pdfkit";

import type { IdeaOutput } from "@/lib/idea-output";

export async function ideaToPdfBuffer(idea: IdeaOutput) {
  const doc = new PDFDocument({ margin: 36 });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk as Buffer));

  doc.fontSize(22).text(`IdeaForge Startup Plan: ${idea.brandName}`);
  doc.moveDown().fontSize(12);
  doc.text(`Startup Idea: ${idea.startupIdea}`);
  doc.text(`Target Customer: ${idea.targetCustomer}`);
  doc.text(`Problem Solved: ${idea.problemSolved}`);
  doc.text(`Domain Suggestions: ${(idea.domainSuggestions ?? []).join(", ")}`);
  doc.text(`Revenue Model: ${idea.revenueModel}`);
  doc.text(`Pricing Strategy: ${idea.pricingStrategy}`);
  doc.text(`Revenue Potential: ${idea.estimatedMonthlyRevenuePotential}`);
  doc.moveDown();
  doc.text(`Product Description: ${idea.productDescription}`);
  doc.moveDown();
  doc.text(`Landing Copy: ${idea.landingPageCopy?.headline} | ${idea.landingPageCopy?.subheadline}`);
  doc.text(`CTA: ${idea.landingPageCopy?.cta}`);
  doc.moveDown();
  doc.text(`Marketing Plan: ${idea.marketingPlan}`);
  doc.moveDown();
  doc.text("Marketing Posts:");
  (idea.marketingPosts ?? []).forEach((post, index) => doc.text(`${index + 1}. ${post}`));
  doc.moveDown();
  doc.text("Competitor Analysis:");
  (idea.competitorAnalysis ?? []).forEach((item) => {
    doc.text(`${item.competitor} — Strength: ${item.strength}; Weakness: ${item.weakness}; Opportunity: ${item.opportunity}`);
  });
  doc.moveDown();
  doc.text("Launch Checklist:");
  (idea.launchChecklist ?? []).forEach((step, index) => doc.text(`${index + 1}. ${step}`));

  doc.end();
  await new Promise<void>((resolve) => doc.on("end", resolve));
  return Buffer.concat(chunks);
}
