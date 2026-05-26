// /api/contact.js  —  Vercel Serverless Function
//
// Receives the contact form POST, logs the submission (visible in
// Vercel → Project → Logs), and forwards it via email using Resend.
//
// SETUP:
//   1. npm i resend
//   2. In Vercel → Project → Settings → Environment Variables, add:
//        RESEND_API_KEY  = re_xxx     (from https://resend.com/api-keys)
//        CONTACT_TO      = you@yourdomain.com
//        CONTACT_FROM    = noreply@yourdomain.com   (must be a verified Resend domain)
//   3. Redeploy.
//
// Logs: every submission is `console.log`'d as structured JSON. View them in
// Vercel dashboard → your project → Logs (filter by /api/contact).

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // CORS / method guard
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const { name, email, phone, event_date, service, message, _honeypot } = body;

  // Honeypot — bots fill hidden fields, humans don't. Silently accept and drop.
  if (_honeypot) {
    console.log("[contact] honeypot triggered, dropping submission");
    return res.status(200).json({ ok: true });
  }

  // Basic validation
  if (!name || !email || !phone || !service || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  // Structured log — appears in Vercel Logs dashboard
  console.log("[contact] new submission", {
    name, email, phone, event_date, service,
    message_preview: String(message).slice(0, 120),
    ts: new Date().toISOString(),
    ip: req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || null,
    ua: req.headers["user-agent"] || null,
  });

  // Forward via email
  try {
    await resend.emails.send({
      from: process.env.CONTACT_FROM,
      to: process.env.CONTACT_TO,
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
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[contact] email send failed", err);
    return res.status(502).json({ error: "Email delivery failed" });
  }
}
