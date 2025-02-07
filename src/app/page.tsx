import { HeroSection } from "@/components/blocks/hero-section-dark"
import { FeatureSteps } from "@/components/blocks/feature-section"
import { Footerdemo } from "@/components/ui/footer-section"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection
        title="Take Control of Your Finances"
        subtitle={{
          regular: "The modern way to ",
          gradient: "track your wealth and expenses.",
        }}
        description="Radium helps you track your net worth, manage budgets, and analyze spending patterns with beautiful visualizations and powerful insights."
        ctaText="Get Started"
        ctaHref="/login"
        bottomImage={{
          light: "/dashboard-preview-light.png",
          dark: "/dashboard-preview-dark.png",
        }}
      />

      <FeatureSteps
        title="Everything you need to manage your finances"
        features={[
          {
            step: "Step 1",
            title: "Track Your Net Worth",
            content: "Monitor your assets and liabilities over time with beautiful charts and insights.",
            image: "/net-worth-preview.png",
          },
          {
            step: "Step 2",
            title: "Manage Your Budget",
            content: "Set monthly budgets and track your spending across different categories.",
            image: "/budget-preview.png",
          },
          {
            step: "Step 3",
            title: "Analyze Your Spending",
            content: "Get detailed insights into your spending patterns and identify areas for improvement.",
            image: "/analytics-preview.png",
          },
          {
            step: "Step 4",
            title: "Plan Your Future",
            content: "Set financial goals and track your progress towards achieving them.",
            image: "/goals-preview.png",
          },
        ]}
      />

      <Footerdemo />
    </div>
  )
} 