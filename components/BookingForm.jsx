"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/client-tracking";

export default function BookingForm({ kind = "interior" }) {
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const isEvent = kind === "event";
  async function submit(event) {
    event.preventDefault(); setState("loading"); setMessage("");
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    body.kind = kind;
    try {
      const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Your booking request could not be submitted.");
      form.reset(); trackEvent("Lead", { content_name: `${kind}_booking` }); setState("success"); setMessage("Your request has been recorded. The team can follow up to plan the next step.");
    } catch (error) { setState("error"); setMessage(error.message); }
  }
  return <form className="form-card" onSubmit={submit}>
    <div className="form-grid">
      <label>Full name<input name="name" required maxLength="120" autoComplete="name" /></label>
      <label>Email<input name="email" type="email" required maxLength="180" autoComplete="email" /></label>
      <label>Phone<input name="phone" type="tel" required maxLength="40" autoComplete="tel" /></label>
      {isEvent ? <>
        <label>Event type<select name="eventType" required defaultValue=""><option value="" disabled>Select event type</option><option>Wedding</option><option>Birthday</option><option>Corporate</option><option>Other custom event</option></select></label>
        <label>Event date<input name="eventDate" type="date" required /></label>
        <label>Venue<input name="venue" required maxLength="200" /></label>
        <label>Location<input name="location" maxLength="200" /></label>
        <label>Expected guests<input name="expectedGuests" type="number" min="1" max="100000" /></label>
        <label>Budget<input name="budget" maxLength="100" placeholder="Share a range" /></label>
      </> : <>
        <label>Property type<select name="propertyType" defaultValue=""><option value="" disabled>Select property type</option><option>Apartment</option><option>Independent home</option><option>Villa</option><option>Commercial</option><option>Other</option></select></label>
        <label>Project type<select name="projectType" required defaultValue=""><option value="" disabled>Select a project</option><option>Modular kitchen</option><option>Wardrobe</option><option>Living room</option><option>Bedroom</option><option>Complete home</option><option>Other</option></select></label>
        <label>Location<input name="location" required maxLength="200" /></label>
        <label>Approximate budget<input name="budget" required maxLength="100" placeholder="e.g. ₹1.5L–₹3L" /></label>
        <label>Preferred site survey date<input name="preferredDate" type="date" /></label>
      </>}
      <label className="full-field">{isEvent ? "Requirements" : "Message"}<textarea name={isEvent ? "requirements" : "message"} rows="4" maxLength="2000" /></label>
    </div>
    {message && <p className={`form-feedback ${state}`}>{message}</p>}
    <button className="button button-dark" disabled={state === "loading"}>{state === "loading" ? "Sending…" : isEvent ? "Request event consultation" : "Book site survey"}</button>
    <small className="form-disclaimer">We’ll use your details to respond to this request. See our <a href="/privacy-policy">privacy policy</a>.</small>
  </form>;
}
