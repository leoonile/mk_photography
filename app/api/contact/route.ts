import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await req.json();
    const { name, email, phone, event_date, service, message, _honeypot } = body;

    // Honeypot check
    if (_honeypot) {
      console.log("[contact] honeypot triggered, dropping submission");
      return NextResponse.json({ ok: true });
    }

    // Basic validation
    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Structured log
    console.log("[contact] new submission", {
      name,
      email,
      phone,
      event_date,
      service,
      message_preview: String(message).slice(0, 120),
      ts: new Date().toISOString(),
      ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null,
      ua: req.headers.get("user-agent") || null,
    });

    // Forward via email
    await resend.emails.send({
      from: process.env.CONTACT_FROM || "noreply@example.com",
      to: process.env.CONTACT_TO || "hello@example.com",
      replyTo: email,
      subject: `New ${service} enquiry from ${name}`,
      text: [
        `Name:       ${name}`,
        `Email:      ${email}`,
        `Phone:      ${phone}`,
        `Event date: ${event_date || "(not provided)"}`,
        `Service:    ${service}`,
        ``,
        `Message:`,
        message,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[contact] email send failed", err);
    return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
  }
}
