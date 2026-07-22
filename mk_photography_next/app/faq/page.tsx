import { FAQAccordion } from "@/components/FAQAccordion";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | MK Photography",
  description: "Everything you need to know about working with MK Photography.",
};

export default function FAQPage() {
  return (
    <main style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--bg)" }}>
      <FAQAccordion hideButton={true} />
    </main>
  );
}
