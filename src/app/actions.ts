"use server";

import { estimate, parseEstimateInput, usd, type Estimate } from "@/lib/estimate";
import { DeliveryError, deliverLead, escapeHtml, sendEstimateToHomeowner } from "@/lib/leads";
import { projectTypes, site, smsConsent, timelines } from "@/lib/site";

export type FormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
  estimate?: Estimate;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const str = (fd: FormData, k: string, max = 200) => String(fd.get(k) ?? "").trim().slice(0, max);
const digits = (s: string) => s.replace(/\D/g, "");

function contactErrors(fd: FormData, opts: { phoneRequired: boolean }) {
  const errors: Record<string, string> = {};
  const name = str(fd, "name", 100);
  const email = str(fd, "email", 200);
  const phone = str(fd, "phone", 30);
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  if (opts.phoneRequired && digits(phone).length < 10) errors.phone = "Please enter a 10-digit phone number.";
  if (!opts.phoneRequired && phone && digits(phone).length < 10) errors.phone = "That phone number looks short.";
  return { errors, name, email, phone };
}

/** Honeypot: real people never fill the hidden "website" field. */
const isBot = (fd: FormData) => str(fd, "website_hp").length > 0;

const failed = (values: Record<string, string>): FormState => ({
  status: "error",
  message: "Sorry, we couldn't send that just now. Please try again in a minute.",
  values,
});

/* ------------------------------------------------------------------ */
/* Homeowner quote request                                              */
/* ------------------------------------------------------------------ */
export async function submitQuote(_prev: FormState, fd: FormData): Promise<FormState> {
  const { errors, name, email, phone } = contactErrors(fd, { phoneRequired: true });
  const types = fd.getAll("projectType").map(String).filter((k) => projectTypes.some((t) => t.key === k));
  const timelineRaw = str(fd, "timeline", 60);
  const timeline = (timelines as readonly string[]).includes(timelineRaw) ? timelineRaw : "";
  const note = str(fd, "note", 2000);
  const source = str(fd, "source", 120);

  if (types.length === 0) errors.projectType = "Pick at least one project type.";
  if (!timeline) errors.timeline = "Choose a timeline.";

  // Optional color preview from the visualizer, only when the visitor ticked the box.
  let attachment: { filename: string; content: string } | undefined;
  const photo = fd.get("photo");
  if (fd.get("attachPhoto") === "on" && photo instanceof File && photo.size > 0) {
    if (!PHOTO_TYPES.includes(photo.type) || photo.size > MAX_PHOTO_BYTES) {
      errors.photo = "That preview couldn't be attached. Untick the box to send without it.";
    } else {
      attachment = { filename: "color-preview.jpg", content: Buffer.from(await photo.arrayBuffer()).toString("base64") };
    }
  }

  const values = { name, email, phone, timeline, note, projectType: types.join(",") };
  if (Object.keys(errors).length) return { status: "error", errors, values };
  if (isBot(fd)) return { status: "success", values: { name } };

  const typeNames = projectTypes.filter((t) => types.includes(t.key)).map((t) => t.name);
  try {
    await deliverLead({
      kind: "quote",
      name,
      email,
      phone,
      fields: [
        ["Name", name],
        ["Phone", phone],
        ["Email", email],
        ["Project type", typeNames.join(", ")],
        ["Timeline", timeline],
        ["Note", note],
        ["Text/phone consent", "Yes (submitted with consent notice)"],
        ["Color preview", attachment ? "Attached" : ""],
        ["Form", source || "quote"],
      ],
      attachments: attachment ? [attachment] : undefined,
      data: {
        projectType: typeNames,
        timeline,
        note,
        consentToContact: true,
        consentText: smsConsent,
        source: source || "quote",
        photoAttached: Boolean(attachment),
      },
    });
  } catch (e) {
    if (e instanceof DeliveryError) return failed(values);
    throw e;
  }
  return { status: "success", values: { name } };
}

/* ------------------------------------------------------------------ */
/* Visualizer + estimate, emailed to the homeowner                      */
/* ------------------------------------------------------------------ */
const MAX_PHOTO_BYTES = 3 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function submitEstimate(_prev: FormState, fd: FormData): Promise<FormState> {
  const { errors, name, email, phone } = contactErrors(fd, { phoneRequired: false });
  const zip = digits(str(fd, "zip", 10));
  const contactMe = fd.get("contactMe") === "on";
  const colorName = str(fd, "colorName", 60);
  const colorHex = /^#[0-9a-f]{6}$/i.test(str(fd, "colorHex", 7)) ? str(fd, "colorHex", 7) : "";
  const input = parseEstimateInput((k) => (fd.has(k) ? String(fd.get(k)) : null));

  if (!input) errors.scope = "Choose interior or exterior.";
  if (zip && zip.length !== 5) errors.zip = "Please enter a 5-digit ZIP code.";
  if (contactMe && digits(phone).length < 10) errors.phone = "Add a phone number so the painter can reach you.";

  const photo = fd.get("photo");
  let attachment: { filename: string; content: string } | undefined;
  if (photo instanceof File && photo.size > 0) {
    if (!PHOTO_TYPES.includes(photo.type) || photo.size > MAX_PHOTO_BYTES) {
      errors.photo = "That photo couldn't be attached. Try a JPG or PNG under 3 MB.";
    } else {
      attachment = {
        filename: `room-preview.${photo.type === "image/png" ? "png" : "jpg"}`,
        content: Buffer.from(await photo.arrayBuffer()).toString("base64"),
      };
    }
  }

  const values = { name, email, phone, zip };
  if (Object.keys(errors).length || !input) return { status: "error", errors, values };

  const result = estimate(input);
  if (isBot(fd)) return { status: "success", estimate: result, values };

  const range = `${usd(result.low)} – ${usd(result.high)}`;
  const colorLine = colorName || colorHex ? `${colorName}${colorHex ? ` (${colorHex})` : ""}` : "";
  const scopeLabel = result.scope === "interior" ? "Interior painting" : "Exterior painting";
  const firstName = name.split(" ")[0];

  const itemsHtml = result.items
    .map((it) => `<tr><td style="padding:6px 12px 6px 0">${escapeHtml(it.label)}</td><td style="padding:6px 0;text-align:right;white-space:nowrap">${usd(it.low)} – ${usd(it.high)}</td></tr>`)
    .join("");
  const assumptionsHtml = result.assumptions.map((a) => `<li>${escapeHtml(a)}</li>`).join("");
  const quoteUrl = `${site.url}/#quote`;
  const guideUrl = `${site.url}/interior-exterior-painting-papillion`;

  const html = `
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#4a5063">${scopeLabel} · planning estimate</p>
    <h1 style="font-size:30px;line-height:1.1;margin:0 0 16px">${range}</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6">Hi ${escapeHtml(firstName)}, here's the estimate you built on our site.${colorLine ? ` Your color: <strong>${escapeHtml(colorLine)}</strong>.` : ""}${attachment ? " Your room preview is attached." : ""}</p>
    <table style="width:100%;border-collapse:collapse;font-size:15px;border-top:1px solid #cdd0d8;border-bottom:1px solid #cdd0d8;margin:0 0 16px">${itemsHtml}</table>
    <p style="margin:0 0 6px;font-size:14px;font-weight:bold">What this assumes</p>
    <ul style="margin:0 0 16px;padding-left:18px;font-size:14px;line-height:1.6">${assumptionsHtml}</ul>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#4a5063">This range is built from published national pricing data, not a quote. A painter sets the real price after seeing the job, because prep, access and paint choice change the hours. <a href="${guideUrl}" style="color:#141a2e">See what drives the price</a>.</p>
    ${
      contactMe
        ? `<p style="margin:0;font-size:15px;line-height:1.6">You asked for a local painter to contact you. They'll reach out to schedule a free on-site quote.</p>`
        : `<p style="margin:0;font-size:15px;line-height:1.6">Want an exact price? <a href="${quoteUrl}" style="color:#141a2e;font-weight:bold">Request a free on-site quote</a> and we'll pass your request to a local painter.</p>`
    }`;
  const text = [
    `${scopeLabel} planning estimate: ${range}`,
    colorLine ? `Color: ${colorLine}` : "",
    "",
    ...result.items.map((it) => `${it.label}: ${usd(it.low)} – ${usd(it.high)}`),
    "",
    "Assumes:",
    ...result.assumptions.map((a) => `- ${a}`),
    "",
    "This is a planning range from published national pricing data, not a quote.",
    contactMe ? "A local painter will contact you to schedule a free on-site quote." : `Request a free on-site quote: ${quoteUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await sendEstimateToHomeowner({ to: email, name, html, text, attachments: attachment ? [attachment] : undefined });
    await deliverLead({
      kind: "estimate",
      name,
      email,
      phone,
      fields: [
        ["Name", name],
        ["Email", email],
        ["Phone", phone],
        ["ZIP", zip],
        ["Wants painter to contact them", contactMe ? "YES" : "No (estimate only)"],
        ["Scope", scopeLabel],
        ["Estimate", range],
        ["Line items", result.items.map((it) => `${it.label}: ${usd(it.low)}–${usd(it.high)}`).join("\n")],
        ["Assumptions", result.assumptions.join("\n")],
        ["Color", colorLine],
      ],
      // The photo goes to a painter only when the homeowner asked to be contacted.
      attachments: contactMe && attachment ? [attachment] : undefined,
    });
  } catch (e) {
    if (e instanceof DeliveryError) return failed(values);
    throw e;
  }

  return { status: "success", estimate: result, values };
}

/* ------------------------------------------------------------------ */
/* Painting company inquiry                                             */
/* ------------------------------------------------------------------ */
export async function submitPainterInquiry(_prev: FormState, fd: FormData): Promise<FormState> {
  const { errors, name, email, phone } = contactErrors(fd, { phoneRequired: false });
  const company = str(fd, "company", 120);
  const websiteUrl = str(fd, "companySite", 200);
  const area = str(fd, "area", 120);
  const message = str(fd, "message", 2000);
  if (company.length < 2) errors.company = "Please enter your company name.";

  const values = { name, email, phone, company, companySite: websiteUrl, area, message };
  if (Object.keys(errors).length) return { status: "error", errors, values };
  if (isBot(fd)) return { status: "success" };

  try {
    await deliverLead({
      kind: "painter-inquiry",
      name,
      email,
      phone,
      fields: [
        ["Name", name],
        ["Company", company],
        ["Email", email],
        ["Phone", phone],
        ["Current website", websiteUrl],
        ["Service area", area],
        ["Message", message],
        ["Page", str(fd, "source", 120)],
      ],
    });
  } catch (e) {
    if (e instanceof DeliveryError) return failed(values);
    throw e;
  }
  return { status: "success", message: "Thanks, we've got it. We'll reply by email." };
}
