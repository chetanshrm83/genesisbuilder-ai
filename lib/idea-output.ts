export type Competitor = {
  competitor: string;
  strength: string;
  weakness: string;
  opportunity: string;
};

export type IdeaOutput = {
  startupIdea: string;
  brandName: string;
  domainSuggestions: string[];
  targetCustomer: string;
  problemSolved: string;
  revenueModel: string;
  pricingStrategy: string;
  marketingPlan: string;
  landingPageCopy: { headline: string; subheadline: string; cta: string };
  productDescription: string;
  marketingPosts: string[];
  competitorAnalysis: Competitor[];
  launchChecklist: string[];
  estimatedMonthlyRevenuePotential: string;
};

function toStringArray(value: unknown, fallback: string[] = []) {
  if (!Array.isArray(value)) return fallback;
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function toCompetitors(value: unknown): Competitor[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const source = item as Record<string, unknown>;
      return {
        competitor: typeof source.competitor === "string" ? source.competitor : "Unknown competitor",
        strength: typeof source.strength === "string" ? source.strength : "N/A",
        weakness: typeof source.weakness === "string" ? source.weakness : "N/A",
        opportunity: typeof source.opportunity === "string" ? source.opportunity : "N/A"
      };
    })
    .filter((item): item is Competitor => item !== null);
}

export function normalizeIdeaOutput(raw: unknown): IdeaOutput {
  const source = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  const marketingPosts = toStringArray(source.marketingPosts).slice(0, 10);
  while (marketingPosts.length < 10) {
    marketingPosts.push("Create value-first educational content for your ideal customer.");
  }

  const launchChecklist = toStringArray(source.launchChecklist);

  return {
    startupIdea: typeof source.startupIdea === "string" ? source.startupIdea : "AI-enabled niche startup",
    brandName: typeof source.brandName === "string" ? source.brandName : "IdeaForge Venture",
    domainSuggestions: toStringArray(source.domainSuggestions, ["ideaforgehq.com"]),
    targetCustomer: typeof source.targetCustomer === "string" ? source.targetCustomer : "Early-stage founders",
    problemSolved: typeof source.problemSolved === "string" ? source.problemSolved : "Lack of clarity on what to build.",
    revenueModel: typeof source.revenueModel === "string" ? source.revenueModel : "Subscription",
    pricingStrategy: typeof source.pricingStrategy === "string" ? source.pricingStrategy : "Tiered monthly plans",
    marketingPlan: typeof source.marketingPlan === "string" ? source.marketingPlan : "Content + community-led growth",
    landingPageCopy:
      source.landingPageCopy && typeof source.landingPageCopy === "object"
        ? {
            headline:
              typeof (source.landingPageCopy as Record<string, unknown>).headline === "string"
                ? ((source.landingPageCopy as Record<string, unknown>).headline as string)
                : "Build your startup with AI",
            subheadline:
              typeof (source.landingPageCopy as Record<string, unknown>).subheadline === "string"
                ? ((source.landingPageCopy as Record<string, unknown>).subheadline as string)
                : "Go from idea to launch plan in minutes.",
            cta:
              typeof (source.landingPageCopy as Record<string, unknown>).cta === "string"
                ? ((source.landingPageCopy as Record<string, unknown>).cta as string)
                : "Get started"
          }
        : {
            headline: "Build your startup with AI",
            subheadline: "Go from idea to launch plan in minutes.",
            cta: "Get started"
          },
    productDescription:
      typeof source.productDescription === "string"
        ? source.productDescription
        : "A practical AI-guided product for validating and launching startup ideas.",
    marketingPosts,
    competitorAnalysis: toCompetitors(source.competitorAnalysis),
    launchChecklist:
      launchChecklist.length >= 8
        ? launchChecklist.slice(0, 10)
        : [
            "Define target persona and top pain point.",
            "Validate demand with 10 customer interviews.",
            "Create MVP scope and roadmap.",
            "Launch landing page with value proposition.",
            "Set up analytics and conversion tracking.",
            "Run first acquisition experiment.",
            "Collect feedback and iterate core workflow.",
            "Prepare monetization and onboarding funnel."
          ],
    estimatedMonthlyRevenuePotential:
      typeof source.estimatedMonthlyRevenuePotential === "string"
        ? source.estimatedMonthlyRevenuePotential
        : "$2k - $10k within first 6 months"
  };
}
