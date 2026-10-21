import nodemailer from "nodemailer";

/**
 * Contact form → email. Sends through the owner's Gmail (an app password) to
 * every address in CONTACT_TO, with the visitor as Reply-To so answering the
 * email answers them. Configuration lives in the environment (see .env.example):
 *   GMAIL_USER          the Gmail account that sends
 *   GMAIL_APP_PASSWORD  a Google app password for it (not the account password)
 *   CONTACT_TO          comma-separated recipients
 */
export const runtime = "nodejs";

const LIMITS = { name: 100, email: 200, message: 5000, minMessage: 10 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Best-effort throttle per IP: an instance's memory, enough to blunt a script hammering the form. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function throttled(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

type Body = { name?: unknown; email?: unknown; message?: unknown; company?: unknown };

function parse(body: Body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const valid =
    name.length > 0 &&
    name.length <= LIMITS.name &&
    EMAIL.test(email) &&
    email.length <= LIMITS.email &&
    message.length >= LIMITS.minMessage &&
    message.length <= LIMITS.message;
  // No line breaks in anything that ends up in a header.
  return valid ? { name: name.replace(/[\r\n]+/g, " "), email, message } : null;
}

const json = (status: number, data: object) => Response.json(data, { status });

export async function POST(request: Request) {
  const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !CONTACT_TO) {
    console.error("contact: missing GMAIL_USER, GMAIL_APP_PASSWORD or CONTACT_TO");
    return json(503, { error: "not_configured" });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) return json(429, { error: "too_many_requests" });

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "invalid_body" });
  }
  // Honeypot: a field people never see. Bots that fill it get a quiet "sent".
  if (typeof body.company === "string" && body.company !== "") return json(200, { ok: true });

  const fields = parse(body);
  if (!fields) return json(400, { error: "invalid_fields" });

  const transport = nodemailer.createTransport({ service: "gmail", auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD } });
  try {
    await transport.sendMail({
      from: { name: "Portafolio", address: GMAIL_USER },
      to: CONTACT_TO.split(",").map((to) => to.trim()).filter(Boolean),
      replyTo: { name: fields.name, address: fields.email },
      subject: `Portafolio: mensaje de ${fields.name}`,
      text: `De: ${fields.name} <${fields.email}>\n\n${fields.message}`,
      html: `<p><strong>De:</strong> ${escapeHtml(fields.name)} &lt;${escapeHtml(fields.email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(fields.message)}</p>`,
    });
  } catch (error) {
    // Log the failure kind only; the visitor's message and address stay out of the logs.
    console.error("contact: send failed", (error as { code?: string }).code ?? "unknown");
    return json(502, { error: "send_failed" });
  }
  return json(200, { ok: true });
}
