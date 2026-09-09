"use client";

import { useState, type FormEvent } from "react";
import { contact } from "@/app/lib/data";

type State = { status: "idle" | "sending" | "success" | "error"; message: string };
export function ContactForm() {
  const [state, setState] = useState<State>({ status: "idle", message: "" });
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setState({ status: "sending", message: "Sending…" });
    const form = event.currentTarget; const data = Object.fromEntries(new FormData(form).entries());
    try { const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); const body = await response.json() as { message?: string }; if (!response.ok) throw new Error(body.message ?? "The message wasn't sent."); form.reset(); setState({ status: "success", message: body.message ?? "Thanks — your project is in." }); } catch (error) { setState({ status: "error", message: error instanceof Error ? error.message : "The message wasn't sent." }); }
  }
  return <form className="contact-form" onSubmit={submit} noValidate><p className="eyebrow">Start a project</p><label>Your name<input name="name" autoComplete="name" minLength={2} maxLength={80} required /></label><label>Email address<input name="email" type="email" autoComplete="email" maxLength={160} required /></label><div className="form-row"><label>Project type<select name="projectType" required defaultValue=""><option value="" disabled>Select</option>{contact.projectTypes.map((item) => <option key={item}>{item}</option>)}</select></label><label>Budget range<select name="budgetRange" defaultValue=""><option value="">Not specified</option>{contact.budgetRanges.map((item) => <option key={item}>{item}</option>)}</select></label></div><label>Tell me about your project<textarea name="message" minLength={20} maxLength={2000} required rows={3} /></label><label className="honeypot" aria-hidden="true">Company website<input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label><button type="submit" disabled={state.status === "sending"}>{state.status === "sending" ? "Sending…" : "Send inquiry ↗"}</button><p className={`form-status ${state.status}`} role="status" aria-live="polite">{state.message}</p></form>;
}
