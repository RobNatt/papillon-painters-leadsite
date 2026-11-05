"use client";

import { useActionState, useId } from "react";
import { submitPainterInquiry, type FormState } from "@/app/actions";
import { Honeypot } from "./ui";

const initial: FormState = { status: "idle" };

export function PainterInquiryForm({ source }: { source: string }) {
  const [state, action, pending] = useActionState(submitPainterInquiry, initial);
  const id = useId();
  const v = state.values ?? {};
  const e = state.errors ?? {};
  const err = (k: string) => (e[k] ? <p id={`${id}-${k}-err`} className="field-error">{e[k]}</p> : null);
  const aria = (k: string) => ({ "aria-invalid": e[k] ? true : undefined, "aria-describedby": e[k] ? `${id}-${k}-err` : undefined });

  if (state.status === "success") {
    return (
      <div role="status" className="grid gap-3">
        <p className="text-h3 wdth-104">{state.message ?? "Thanks, we've got it."}</p>
        <p className="text-graphite">We&rsquo;ll look at your current site and Google Business Profile before we talk.</p>
      </div>
    );
  }

  return (
    <form action={action} className="relative grid gap-5" noValidate>
      <input type="hidden" name="source" value={source} />
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <label className="field-label" htmlFor={`${id}-name`}>Your name</label>
          <input id={`${id}-name`} name="name" className="input" autoComplete="name" required defaultValue={v.name} {...aria("name")} />
          {err("name")}
        </div>
        <div className="field">
          <label className="field-label" htmlFor={`${id}-company`}>Painting company</label>
          <input id={`${id}-company`} name="company" className="input" autoComplete="organization" required defaultValue={v.company} {...aria("company")} />
          {err("company")}
        </div>
        <div className="field">
          <label className="field-label" htmlFor={`${id}-email`}>Email</label>
          <input id={`${id}-email`} name="email" type="email" className="input" autoComplete="email" required defaultValue={v.email} {...aria("email")} />
          {err("email")}
        </div>
        <div className="field">
          <label className="field-label" htmlFor={`${id}-phone`}>Phone <span className="text-graphite">(optional)</span></label>
          <input id={`${id}-phone`} name="phone" type="tel" className="input" autoComplete="tel" defaultValue={v.phone} {...aria("phone")} />
          {err("phone")}
        </div>
        <div className="field">
          <label className="field-label" htmlFor={`${id}-site`}>Current website <span className="text-graphite">(if any)</span></label>
          <input id={`${id}-site`} name="companySite" className="input" inputMode="url" placeholder="yourcompany.com" defaultValue={v.companySite} />
        </div>
        <div className="field">
          <label className="field-label" htmlFor={`${id}-area`}>Cities you serve</label>
          <input id={`${id}-area`} name="area" className="input" placeholder="Papillion, La Vista, Bellevue…" defaultValue={v.area} />
        </div>
      </div>
      <div className="field">
        <label className="field-label" htmlFor={`${id}-msg`}>Where do your leads come from today? <span className="text-graphite">(optional)</span></label>
        <textarea id={`${id}-msg`} name="message" className="input" placeholder="Referrals, Angi, Thumbtack, Google Ads…" defaultValue={v.message} />
      </div>
      {state.status === "error" && state.message ? <p role="alert" className="field-error">{state.message}</p> : null}
      <button type="submit" className="btn btn-primary justify-self-start" disabled={pending} data-magnetic="">
        {pending ? "Sending…" : "Send"} <span className="arrow" aria-hidden="true">→</span>
      </button>
    </form>
  );
}
