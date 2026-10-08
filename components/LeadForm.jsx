"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/client-tracking";

export default function LeadForm({ kind = "contact", submitLabel = "Send enquiry" }) {
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  async function submit(event) {
    event.preventDefault();
    setState("loading"); setMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const body = Object.fromEntries(form.entries());
    body.kind = kind;
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Your enquiry could not be submitted.");
      formElement.reset();
      trackEvent("Lead", { content_name: kind });
      setState(data.emailSent ? "success" : "warning");
      setMessage(data.message || "Your enquiry was submitted.");
    } catch (error) { setState("error"); setMessage(error.message); }
  }
  return <form className="form-card" onSubmit={submit}>
    <div className="form-grid"><label>Full name<input name="name" required maxLength="120" autoComplete="name" /></label>
      <label>Email<input name="email" type="email" required maxLength="180" autoComplete="email" /></label>
      <label>Phone<input name="phone" type="tel" required maxLength="40" autoComplete="tel" /></label>
      {kind === "b2b" && <><label>Company<input name="company" maxLength="180" autoComplete="organization" /></label><label>GSTIN <span className="optional">(optional)</span><input name="gstin" maxLength="30" /></label></>}
      <label className="full-field">{kind === "b2b" ? "Project / order requirements" : "How can we help?"}<textarea name="requirements" required rows="4" maxLength="3000" /></label>
    </div>
    {message && <p className={`form-feedback ${state}`}>{message}</p>}
    <button className="button button-dark" disabled={state === "loading"}>{state === "loading" ? "Sending…" : submitLabel}</button>
    <small className="form-disclaimer">Your details are used to respond to this enquiry. See our <a href="/privacy-policy">privacy policy</a>.</small>
  </form>;
}
