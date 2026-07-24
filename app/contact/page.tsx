import { ContactSection } from "@/components/ContactSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | MK Photography",
  description: "Ready to capture your special moments? Get in touch with us.",
};

export default function ContactPage() {
  return (
    <main style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--bg)" }}>
      <ContactSection />
    </main>
  );
}
