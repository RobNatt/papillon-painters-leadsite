"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { submitQuote, type FormState } from "@/app/actions";
import { projectTypes, smsConsent, timelines } from "@/lib/site";
import { Disclosure, Honeypot } from "./ui";

const initial: FormState = { status: "idle" };

export const QUOTE_HEADING = "Tell us about your project and we’ll connect you with a local Papillion painter.";

/**
 * Homeowner quote request. Works without JS (plain form post to the server
 * action); with JS it shows inline errors and an animated success state
 * without a reload.
 */
export function QuoteForm({
  source,
  headingLevel = "h2",
  defaultType,
}: {
  source: string;
  headingLevel?: "h2" | "h3";
  defaultType?: string;
}) {
  const [state, action, pending] = useActionState(submitQuote, initial);
  const id = useId();
  const Heading = headingLevel;
  const v = state.values ?? {};
  // Hide a field's error once the visitor edits that field (until the next submit).
  const [edited, setEdited] = useState<{ s: FormState; keys: Set<string> }>({ s: state, keys: new Set() });
  const editedKeys = edited.s === state ? edited.keys : new Set<string>();
  const e = Object.fromEntries(Object.entries(state.errors ?? {}).filter(([k]) => !editedKeys.has(k)));
  const onEdit = (ev: React.FormEvent<HTMLFormElement>) => {
    const name = (ev.target as HTMLInputElement).name;
    if (name && e[name]) setEdited({ s: state, keys: new Set(editedKeys).add(name) });
  };
  const chosen = (v.projectType ?? defaultType ?? "").split(",");
  const err = (k: string) =>
    e[k] ? (
      <p id={`${id}-${k}-err`} className="field-error">
        {e[k]}
      </p>
    ) : null;
  const aria = (k: string) => ({
    "aria-invalid": e[k] ? true : undefined,
    "aria-describedby": e[k] ? `${id}-${k}-err` : undefined,
  });

  if (state.status === "success") return <QuoteSuccess name={v.name ?? ""} Heading={Heading} />;

  return (
    <form action={action} onChange={onEdit} className="relative grid gap-5" noValidate>
      <Heading className="text-h3 wdth-104 text-balance">{QUOTE_HEADING}</Heading>
      <input type="hidden" name="source" value={source} />
      <Honeypot />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field sm:col-span-2">
          <label className="field-label" htmlFor={`${id}-name`}>Name</label>
          <input id={`${id}-name`} name="name" className="input" autoComplete="name" required defaultValue={v.name} {...aria("name")} />
          {err("name")}
        </div>
        <div className="field">
          <label className="field-label" htmlFor={`${id}-phone`}>Phone</label>
          <input id={`${id}-phone`} name="phone" type="tel" className="input" autoComplete="tel" required defaultValue={v.phone} {...aria("phone")} />
          {err("phone")}
        </div>
        <div className="field">
          <label className="field-label" htmlFor={`${id}-email`}>Email</label>
          <input id={`${id}-email`} name="email" type="email" className="input" autoComplete="email" required defaultValue={v.email} {...aria("email")} />
          {err("email")}
        </div>
      </div>

      <fieldset className="grid gap-3" {...aria("projectType")}>
        <legend className="field-label mb-3">Project type</legend>
        <div className="flex flex-wrap gap-2">
          {projectTypes.map((t) => (
            <label key={t.key} className="choice">
              <input type="checkbox" name="projectType" value={t.key} defaultChecked={chosen.includes(t.key)} />
              <span>{t.name}</span>
            </label>
          ))}
        </div>
        {err("projectType")}
      </fieldset>

      <div className="field">
        <label className="field-label" htmlFor={`${id}-timeline`}>Timeline</label>
        <select id={`${id}-timeline`} name="timeline" className="input" defaultValue={v.timeline ?? timelines[1]} {...aria("timeline")}>
          {timelines.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        {err("timeline")}
      </div>

      <div className="field">
        <label className="field-label" htmlFor={`${id}-note`}>
          Note <span className="text-graphite">(optional)</span>
        </label>
        <textarea id={`${id}-note`} name="note" className="input" placeholder="Rooms, square footage, peeling areas, HOA color rules…" defaultValue={v.note} />
      </div>

      {state.status === "error" && state.message ? (
        <p role="alert" className="field-error">{state.message}</p>
      ) : null}
      {state.status === "error" && !state.message ? (
        <p role="alert" className="sr-only">Please fix the highlighted fields.</p>
      ) : null}

      <div className="grid gap-3">
        <button type="submit" className="btn btn-primary justify-self-start" disabled={pending} data-magnetic="">
          {pending ? "Sending…" : "Get my free quote"} <span className="arrow" aria-hidden="true">→</span>
        </button>
        <p className="text-small text-graphite">{smsConsent}</p>
      </div>
      <Disclosure />
    </form>
  );
}

/** Animated confirmation: a paint stroke sweeps in, the check draws, the copy rises. */
function QuoteSuccess({ name, Heading }: { name: string; Heading: "h2" | "h3" }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  const first = name.split(" ")[0];
  return (
    <div className="quote-success grid gap-5" role="status">
      <div className="qs-mark" aria-hidden="true">
        <span className="qs-stroke" />
        <svg viewBox="0 0 52 52" className="qs-check">
          <circle cx="26" cy="26" r="24" />
          <path d="M15 27.5l7.5 7.5L38 19" />
        </svg>
      </div>
      <Heading ref={ref} tabIndex={-1} className="qs-rise text-h3 wdth-104 outline-none" style={{ "--i": 0 } as React.CSSProperties}>
        {first ? `Thanks, ${first}. Your request is in.` : "Thanks. Your request is in."}
      </Heading>
      <p className="qs-rise text-graphite" style={{ "--i": 1 } as React.CSSProperties}>
        We&rsquo;re matching you with a local Papillion painter now. Here&rsquo;s what happens next:
      </p>
      <ol className="grid gap-3 text-small">
        {[
          "A local painter reviews your project details.",
          "They call or text you to set up a free walk-through.",
          "You get a written quote. Hire them only if it fits.",
        ].map((step, i) => (
          <li key={step} className="qs-rise flex items-start gap-3 border-t border-ink/15 pt-3" style={{ "--i": i + 2 } as React.CSSProperties}>
            <span className="label flex-none text-graphite">0{i + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
