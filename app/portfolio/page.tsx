import { PortfolioGallery } from "@/components/PortfolioGallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | MK Photography",
  description: "A curated collection of our finest work across weddings, portraits, and commercial photography.",
};

export default function PortfolioPage() {
  return (
    <main style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--bg)" }}>
      <PortfolioGallery hideButton={true} />
    </main>
  );
}
