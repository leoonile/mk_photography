import { PricingSection } from "@/components/PricingSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | MK Photography",
  description: "Transparent pricing across every service we offer. Select a package that fits your needs.",
};

export default function PricingPage() {
  return (
    <main style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--bg)" }}>
      <PricingSection hideButton={true} />
    </main>
  );
}
