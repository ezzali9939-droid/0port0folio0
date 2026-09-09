import { createHash } from "node:crypto";
import { contactSubmissionSchema } from "@/app/lib/contact-schema";
import { createSupabaseAdmin } from "@/app/lib/supabase-server";

const MAX_BODY_BYTES = 16_384;
const RATE_LIMIT = 5;

function requestFingerprint(request: Request) {
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  return createHash("sha256").update(`${process.env.CONTACT_HASH_SECRET ?? "local-development"}:${ip}`).digest("hex");
}

async function sendNotification(payload: { name: string; email: string; projectType: string; budgetRange: string | null; message: string }) {
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL || !process.env.CONTACT_FROM_EMAIL) return;
  const safe = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char] ?? char);
  await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL, to: [process.env.CONTACT_TO_EMAIL], reply_to: payload.email, subject: `New portfolio inquiry — ${payload.projectType}`, html: `<h1>New project inquiry</h1><p><strong>Name:</strong> ${safe(payload.name)}</p><p><strong>Email:</strong> ${safe(payload.email)}</p><p><strong>Type:</strong> ${safe(payload.projectType)}</p><p><strong>Budget:</strong> ${safe(payload.budgetRange ?? "Not specified")}</p><p>${safe(payload.message).replace(/\n/g, "<br>")}</p>` }) });
}

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) return Response.json({ ok: false, message: "Request is too large." }, { status: 413 });
  let raw: unknown;
  try { raw = await request.json(); } catch { return Response.json({ ok: false, message: "Invalid request." }, { status: 400 }); }
  if (typeof raw === "object" && raw !== null && "companyWebsite" in raw && raw.companyWebsite) return Response.json({ ok: true }, { status: 202 });
  const result = contactSubmissionSchema.safeParse(raw);
  if (!result.success) return Response.json({ ok: false, message: "Check the highlighted fields.", fields: result.error.flatten().fieldErrors }, { status: 422 });
  const supabase = createSupabaseAdmin();
  if (!supabase) return Response.json({ ok: false, message: "Contact service is not configured yet." }, { status: 503 });
  const ipHash = requestFingerprint(request);
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
  if (countError) return Response.json({ ok: false, message: "Contact service is temporarily unavailable." }, { status: 503 });
  if ((count ?? 0) >= RATE_LIMIT) return Response.json({ ok: false, message: "Too many messages. Try again later." }, { status: 429, headers: { "Retry-After": "3600" } });
  const payload = result.data;
  const { error } = await supabase.from("contact_submissions").insert({ name: payload.name, email: payload.email, project_type: payload.projectType, budget_range: payload.budgetRange, message: payload.message, ip_hash: ipHash, user_agent: request.headers.get("user-agent")?.slice(0, 512) ?? null, referrer: request.headers.get("referer")?.slice(0, 1000) ?? null });
  if (error) return Response.json({ ok: false, message: "Your message could not be saved. Try again." }, { status: 503 });
  await sendNotification(payload).catch(() => undefined);
  return Response.json({ ok: true, message: "Thanks — your project is in. I'll get back to you with clear next steps." }, { status: 201 });
}
