import "server-only";

/**
 * Lead delivery. Every form on the site goes through `deliverLead`, which
 * POSTs the lead as JSON to FORM_ENDPOINT_URL (CRM / automation webhook)
 * and emails it through Resend. Either one is enough; both can run.
 */

export type LeadKind = "quote" | "estimate" | "painter-inquiry";

export type Lead = {
  kind: LeadKind;
  name: string;
  email: string;
  phone?: string;
  /** Human-readable field list for the internal notification. */
  fields: [label: string, value: string][];
  /** Machine-readable fields for the form endpoint. */
  data?: Record<string, string | string[] | boolean>;
  attachments?: { filename: string; content: string /* base64 */ }[];
};

type Email = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: Lead["attachments"];
};

const env = {
  apiKey: process.env.RESEND_API_KEY,
  from: process.env.EMAIL_FROM ?? "Papillion Painters <quotes@papillionpainters.com>",
  leadTo: (process.env.LEAD_TO_EMAIL ?? "").split(",").map((s) => s.trim()).filter(Boolean),
  formEndpoint: process.env.FORM_ENDPOINT_URL ?? "",
};

const emailConfigured = () => Boolean(env.apiKey && env.leadTo.length);

export class DeliveryError extends Error {}

async function sendEmail(email: Email): Promise<void> {
  if (!env.apiKey || env.leadTo.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[leads] RESEND_API_KEY / LEAD_TO_EMAIL not set; email not sent.\n  to: ${email.to.join(", ")}\n  subject: ${email.subject}\n${email.text}`);
      return;
    }
    throw new DeliveryError("Email delivery is not configured.");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.from,
      to: email.to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      reply_to: email.replyTo,
      attachments: email.attachments,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error(`[leads] Resend error ${res.status}: ${detail}`);
    throw new DeliveryError("Email delivery failed.");
  }
}

const SUBJECTS: Record<LeadKind, string> = {
  quote: "New quote request",
  estimate: "New estimate lead",
  "painter-inquiry": "Painter inquiry (website/SEO)",
};

/** Send a lead to the form endpoint and/or the owner's inbox. */
export async function deliverLead(lead: Lead): Promise<void> {
  if (!env.formEndpoint && !emailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[leads] FORM_ENDPOINT_URL and Resend not set; lead not sent.\n${JSON.stringify(endpointPayload(lead), null, 2)}`);
      return;
    }
    throw new DeliveryError("Lead delivery is not configured.");
  }

  const jobs: Promise<void>[] = [];
  if (env.formEndpoint) jobs.push(postToEndpoint(lead));
  if (emailConfigured()) jobs.push(emailLead(lead));
  const results = await Promise.allSettled(jobs);
  // Succeed if any channel took the lead; fail only if all of them did.
  if (results.every((r) => r.status === "rejected")) throw new DeliveryError("Lead delivery failed.");
  for (const r of results) if (r.status === "rejected") console.error("[leads] one channel failed:", r.reason);
}

function endpointPayload(lead: Lead) {
  return {
    kind: lead.kind,
    name: lead.name,
    email: lead.email,
    phone: lead.phone ?? "",
    ...lead.data,
    fields: Object.fromEntries(lead.fields.filter(([, v]) => v)),
    site: "papillionpainters.com",
    submittedAt: new Date().toISOString(),
  };
}

async function postToEndpoint(lead: Lead): Promise<void> {
  const res = await fetch(env.formEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(endpointPayload(lead)),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    console.error(`[leads] form endpoint error ${res.status}: ${await res.text().catch(() => "")}`);
    throw new DeliveryError("Form endpoint rejected the lead.");
  }
}

async function emailLead(lead: Lead): Promise<void> {
  const rows = lead.fields
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#4a5063;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0">${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("");
  const text = lead.fields.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");

  await sendEmail({
    to: env.leadTo,
    subject: `${SUBJECTS[lead.kind]}: ${lead.name}`,
    replyTo: lead.email,
    html: layout(`<h1 style="font-size:20px;margin:0 0 16px">${SUBJECTS[lead.kind]}</h1><table style="border-collapse:collapse;font-size:15px">${rows}</table>`),
    text,
    attachments: lead.attachments,
  });
}

/** Email the homeowner their own estimate. */
export async function sendEstimateToHomeowner(args: {
  to: string;
  name: string;
  html: string;
  text: string;
  attachments?: Lead["attachments"];
}): Promise<void> {
  await sendEmail({
    to: [args.to],
    subject: "Your painting estimate from Papillion Painters",
    html: layout(args.html),
    text: args.text,
    attachments: args.attachments,
  });
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function layout(inner: string): string {
  return `<!doctype html><html><body style="margin:0;background:#ecedf0;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#141a2e"><div style="max-width:560px;margin:0 auto;background:#ffffff;padding:28px">${inner}<p style="margin:28px 0 0;font-size:12px;line-height:1.5;color:#4a5063">Papillion Painters is a referral service. We are not a painting company and do not perform any work. Independent local painters provide the quotes and do the painting.</p></div></body></html>`;
}
