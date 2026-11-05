"use client";

import Link from "next/link";
import { useActionState, useCallback, useEffect, useId, useRef, useState } from "react";
import { submitEstimate, type FormState } from "@/app/actions";
import { conditionLabels, roomSizeLabels, sidingLabels, usd, type Scope } from "@/lib/estimate";
import { Honeypot } from "../ui";
import type { Recolor } from "./recolor";

/** House palette. Our own names: these are not any paint brand's colors. */
const SWATCHES = [
  { name: "Chalk Linen", hex: "#ece6da" },
  { name: "Wheat Straw", hex: "#d8c39a" },
  { name: "Prairie Greige", hex: "#c9c1b3" },
  { name: "Warm Taupe", hex: "#a08e7a" },
  { name: "Blush Stone", hex: "#d9b8ae" },
  { name: "Clay Pot", hex: "#b7735a" },
  { name: "Wet Ochre", hex: "#e2a83c" },
  { name: "Soft Fern", hex: "#b9c4a8" },
  { name: "Sage Field", hex: "#9daa8f" },
  { name: "Prairie Green", hex: "#2f5b46" },
  { name: "Mist Blue", hex: "#bccad3" },
  { name: "Harbor Blue", hex: "#5d7c99" },
  { name: "Platte Navy", hex: "#1f2a4d" },
  { name: "Dusk Plum", hex: "#5b3b55" },
  { name: "Storm Grey", hex: "#8e9396" },
  { name: "Night Charcoal", hex: "#3a3b3f" },
];

type Color = { name: string; hex: string };
type Source = "none" | "sample" | "upload";

export function EstimateStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const engineRef = useRef<Recolor | null>(null);
  const photoBlob = useRef<Blob | null>(null);

  const [source, setSource] = useState<Source>("none");
  const [loading, setLoading] = useState(false);
  const [painted, setPainted] = useState(0);
  const [activeId, setActiveId] = useState(0);
  const [color, setColor] = useState<Color>(SWATCHES[11]);
  const [tolerance, setTolerance] = useState(16);
  const [split, setSplit] = useState(0);
  const [hint, setHint] = useState("");
  const [scope, setScope] = useState<Scope>("interior");
  const [formKey, setFormKey] = useState(0);
  const pendingTap = useRef<{ fx: number; fy: number } | null>(null);

  const redraw = useCallback(() => {
    const engine = engineRef.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (engine && ctx) engine.render(ctx, split);
  }, [split]);

  useEffect(redraw, [redraw]);

  // Keep a ready-to-send JPEG of the preview (uploads only; the sample isn't the visitor's room).
  useEffect(() => {
    if (source !== "upload" || !engineRef.current) {
      photoBlob.current = null;
      return;
    }
    const t = window.setTimeout(async () => {
      photoBlob.current = (await engineRef.current?.toBlob()) ?? null;
    }, 400);
    return () => window.clearTimeout(t);
  }, [source, painted, color, activeId]);

  const paintAt = useCallback(
    (fx: number, fy: number) => {
      const engine = engineRef.current;
      if (!engine) return;
      const x = fx * engine.w;
      const y = fy * engine.h;
      const existing = engine.regionAt(x, y);
      if (existing) {
        setActiveId(existing);
        const hex = engine.colorOf(existing);
        const match = SWATCHES.find((s) => s.hex === hex);
        if (hex) setColor(match ?? { name: "Custom color", hex });
        setHint("Wall selected. Pick a color to change it.");
        return;
      }
      const id = engine.fill(x, y, color.hex, tolerance);
      if (!id) {
        setHint("That spot is too small to be a wall. Tap a larger area, or raise the edge sensitivity.");
        return;
      }
      setHint("");
      setActiveId(id);
      setPainted(engine.regionCount);
      engine.render(canvasRef.current!.getContext("2d")!, split);
    },
    [color.hex, tolerance, split],
  );

  const paintAtRef = useRef(paintAt);
  useEffect(() => {
    paintAtRef.current = paintAt;
  }, [paintAt]);

  const load = useCallback(async (input: File | string, kind: Source) => {
    setLoading(true);
    setHint("");
    try {
      const { Recolor, loadImage } = await import("./recolor");
      const img = await loadImage(input);
      const engine = new Recolor(img as CanvasImageSource & { width: number; height: number });
      engineRef.current = engine;
      const canvas = canvasRef.current!;
      canvas.width = engine.w;
      canvas.height = engine.h;
      engine.render(canvas.getContext("2d")!, 0);
      setSplit(0);
      setPainted(0);
      setActiveId(0);
      setSource(kind);
      if (pendingTap.current) {
        const { fx, fy } = pendingTap.current;
        pendingTap.current = null;
        requestAnimationFrame(() => paintAtRef.current(fx, fy));
      }
    } catch {
      setHint("We couldn't open that image. Try a JPG or PNG photo.");
    } finally {
      setLoading(false);
    }
  }, []);

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    paintAt((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  };

  const pickColor = (c: Color) => {
    setColor(c);
    const engine = engineRef.current;
    if (engine && activeId) {
      engine.setColor(activeId, c.hex);
      redraw();
      setPainted(engine.regionCount);
    }
  };

  const undo = () => {
    const engine = engineRef.current;
    if (!engine) return;
    setActiveId(engine.undo());
    setPainted(engine.regionCount);
    redraw();
  };
  const reset = () => {
    engineRef.current?.reset();
    setActiveId(0);
    setPainted(0);
    redraw();
  };

  const swatchName = useId();

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      {/* ---------------- Visualizer ---------------- */}
      <div className="grid content-start gap-4 lg:col-span-7">
        <div className="relative overflow-hidden bg-primer-deep">
          <canvas
            ref={canvasRef}
            onClick={onCanvasClick}
            className={`block h-auto w-full cursor-crosshair touch-manipulation ${source === "none" ? "hidden" : ""}`}
            role="img"
            aria-label={`Room preview. ${painted} area${painted === 1 ? "" : "s"} painted. Tap a wall to paint it with ${color.name}.`}
          />
          {source === "none" ? (
            <button
              type="button"
              className="group relative block w-full cursor-crosshair text-left"
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                pendingTap.current = { fx: (e.clientX - r.left) / r.width, fy: (e.clientY - r.top) / r.height };
                load("/visualizer/sample-room.svg", "sample");
              }}
              aria-label="Try the visualizer on a sample room"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/visualizer/sample-room.svg" alt="" width={1200} height={800} className="block h-auto w-full" />
              <span className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-3 bg-chalk/95 px-4 py-3 text-small">
                <span className="font-semibold">Tap any wall to try a color</span>
                <span className="text-graphite">Sample room · or upload your own below</span>
              </span>
            </button>
          ) : null}
          {loading ? (
            <div className="absolute inset-0 grid place-items-center bg-primer/70 text-small font-semibold" role="status">
              Preparing your photo…
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-primary min-h-11 px-5 py-2.5 text-small" onClick={() => fileRef.current?.click()}>
            {source === "upload" ? "Use a different photo" : "Upload a photo of your room"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) load(f, "upload");
              e.target.value = "";
            }}
          />
          {source !== "sample" ? (
            <button type="button" className="btn btn-ghost min-h-11 px-5 py-2.5 text-small" onClick={() => load("/visualizer/sample-room.svg", "sample")}>
              Use the sample room
            </button>
          ) : null}
          {painted > 0 ? (
            <>
              <button type="button" className="tlink text-small" onClick={undo}>Undo last wall</button>
              <button type="button" className="tlink text-small" onClick={reset}>Clear all</button>
            </>
          ) : null}
        </div>

        <p className="min-h-6 text-small text-graphite" aria-live="polite">
          {hint ||
            (source === "none"
              ? "Your photo is processed on your device. It's only sent if you choose to email the estimate."
              : painted === 0
                ? "Tap a wall to paint it. Tap more walls to add them, or tap a painted wall to change its color."
                : `${painted} area${painted === 1 ? "" : "s"} painted. Pick a color to change the selected wall.`)}
        </p>

        {source !== "none" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field">
              <span className="field-label">Before / after</span>
              <input type="range" min={0} max={100} value={Math.round(split * 100)} onChange={(e) => setSplit(Number(e.target.value) / 100)} className="accent-[var(--color-ink)]" />
            </label>
            <label className="field">
              <span className="field-label">Edge sensitivity (raise it if the paint stops short)</span>
              <input type="range" min={6} max={34} value={tolerance} onChange={(e) => setTolerance(Number(e.target.value))} className="accent-[var(--color-ink)]" />
            </label>
          </div>
        ) : null}
      </div>

      {/* ---------------- Color + estimate ---------------- */}
      <div className="grid content-start gap-10 lg:col-span-5">
        <fieldset className="grid gap-4">
          <legend className="mb-4 flex w-full items-baseline justify-between gap-4">
            <span className="text-h3 wdth-104">1. Pick a color</span>
            <span className="label text-graphite">{color.name}</span>
          </legend>
          <div className="grid grid-cols-8 gap-2">
            {SWATCHES.map((s) => (
              <label key={s.hex} className="relative aspect-[3/4] cursor-pointer" title={s.name}>
                <input
                  type="radio"
                  name={swatchName}
                  className="peer sr-only"
                  checked={color.hex === s.hex}
                  onChange={() => pickColor(s)}
                />
                <span className="absolute inset-0 transition-transform peer-checked:-translate-y-1 peer-checked:shadow-[0_0_0_2px_var(--color-primer),0_0_0_4px_var(--color-ink)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-tape" style={{ background: s.hex }} />
                <span className="sr-only">{s.name}</span>
              </label>
            ))}
          </div>
          <label className="flex items-center gap-3 text-small">
            <input
              type="color"
              value={color.hex}
              onChange={(e) => pickColor({ name: "Custom color", hex: e.target.value })}
              className="h-10 w-14 cursor-pointer border border-line bg-chalk p-1"
            />
            Or match any color (paste a paint chip&rsquo;s color code)
          </label>
        </fieldset>

        <EstimateForm
          key={formKey}
          scope={scope}
          setScope={setScope}
          color={color}
          getPhoto={() => photoBlob.current}
          hasPhoto={source === "upload"}
          onRestart={() => setFormKey((k) => k + 1)}
        />
      </div>
    </div>
  );
}

const initial: FormState = { status: "idle" };

function EstimateForm({
  scope,
  setScope,
  color,
  getPhoto,
  hasPhoto,
  onRestart,
}: {
  scope: Scope;
  setScope: (s: Scope) => void;
  color: Color;
  getPhoto: () => Blob | null;
  hasPhoto: boolean;
  onRestart: () => void;
}) {
  const [state, action, pending] = useActionState(submitEstimate, initial);
  const id = useId();
  const v = state.values ?? {};
  const e = state.errors ?? {};
  const err = (k: string) => (e[k] ? <p id={`${id}-${k}-err`} className="field-error">{e[k]}</p> : null);
  const aria = (k: string) => ({ "aria-invalid": e[k] ? true : undefined, "aria-describedby": e[k] ? `${id}-${k}-err` : undefined });

  if (state.status === "success" && state.estimate) {
    const est = state.estimate;
    return (
      <div className="grid gap-6 bg-chalk p-6 sm:p-8" role="status">
        <p className="label text-graphite">{est.scope === "interior" ? "Interior" : "Exterior"} · planning estimate</p>
        <p className="text-h1 wdth-108">
          {usd(est.low)}
          <span className="text-graphite"> – </span>
          {usd(est.high)}
        </p>
        <table className="w-full text-small">
          <tbody>
            {est.items.map((it) => (
              <tr key={it.label} className="border-t border-line">
                <td className="py-2 pr-3">{it.label}</td>
                <td className="whitespace-nowrap py-2 text-right">{usd(it.low)} – {usd(it.high)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-small text-graphite">
          We emailed this to you. It&rsquo;s a planning range from published pricing data, not a quote: a painter sets the
          real price after seeing the job.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/#quote" className="btn btn-primary" data-magnetic="">
            Get an exact on-site quote <span className="arrow" aria-hidden="true">→</span>
          </Link>
          <button type="button" className="tlink text-small" onClick={onRestart}>Build another estimate</button>
        </div>
      </div>
    );
  }

  const withPhoto = (fd: FormData) => {
    const blob = getPhoto();
    if (blob) fd.set("photo", new File([blob], "room-preview.jpg", { type: "image/jpeg" }));
    action(fd);
  };

  return (
    <form action={hasPhoto ? withPhoto : action} className="relative grid gap-8" noValidate>
      <Honeypot />
      <input type="hidden" name="colorName" value={color.name} />
      <input type="hidden" name="colorHex" value={color.hex} />

      <fieldset className="grid gap-5">
        <legend className="mb-4 text-h3 wdth-104">2. Describe the job</legend>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Interior or exterior">
          {(["interior", "exterior"] as const).map((s) => (
            <label key={s} className="choice">
              <input type="radio" name="scope" value={s} checked={scope === s} onChange={() => setScope(s)} />
              <span>{s === "interior" ? "Interior" : "Exterior"}</span>
            </label>
          ))}
        </div>

        {scope === "interior" ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="field">
              <label className="field-label" htmlFor={`${id}-rooms`}>Number of rooms</label>
              <input id={`${id}-rooms`} name="rooms" type="number" min={1} max={15} defaultValue={1} className="input" />
            </div>
            <div className="field">
              <label className="field-label" htmlFor={`${id}-size`}>Typical room size</label>
              <select id={`${id}-size`} name="roomSize" className="input" defaultValue="medium">
                {Object.entries(roomSizeLabels).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-label" htmlFor={`${id}-height`}>Ceiling height</label>
              <select id={`${id}-height`} name="ceilingHeight" className="input" defaultValue="standard">
                <option value="standard">8 ft (standard)</option>
                <option value="tall">9–10 ft</option>
                <option value="vaulted">Vaulted or two-story</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label" htmlFor={`${id}-doors`}>Doors to paint</label>
              <input id={`${id}-doors`} name="doors" type="number" min={0} max={30} defaultValue={0} className="input" />
            </div>
            <div className="field sm:col-span-2">
              <label className="field-label" htmlFor={`${id}-cond`}>Wall condition</label>
              <select id={`${id}-cond`} name="condition" className="input" defaultValue="good">
                {Object.entries(conditionLabels).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <Toggle name="ceilings" label="Ceilings too" />
              <Toggle name="trim" label="Baseboards & trim" defaultChecked />
              <Toggle name="colorChange" label="Big color change" />
              <Toggle name="premiumPaint" label="Premium paint" />
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="field">
              <label className="field-label" htmlFor={`${id}-sqft`}>Home size (finished sq ft)</label>
              <input id={`${id}-sqft`} name="homeSqft" type="number" min={600} max={8000} step={50} defaultValue={1800} className="input" />
            </div>
            <div className="field">
              <label className="field-label" htmlFor={`${id}-stories`}>Stories</label>
              <select id={`${id}-stories`} name="stories" className="input" defaultValue="2">
                <option value="1">1 story / ranch</option>
                <option value="2">2 stories</option>
                <option value="3">3 or walkout + 2</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label" htmlFor={`${id}-siding`}>Siding</label>
              <select id={`${id}-siding`} name="siding" className="input" defaultValue="vinyl">
                {Object.entries(sidingLabels).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-label" htmlFor={`${id}-garage`}>Garage doors</label>
              <input id={`${id}-garage`} name="garageDoors" type="number" min={0} max={4} defaultValue={1} className="input" />
            </div>
            <div className="field">
              <label className="field-label" htmlFor={`${id}-cond`}>Surface condition</label>
              <select id={`${id}-cond`} name="condition" className="input" defaultValue="good">
                {Object.entries(conditionLabels).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-label" htmlFor={`${id}-deck`}>Deck to stain (sq ft, 0 if none)</label>
              <input id={`${id}-deck`} name="deckSqft" type="number" min={0} max={2000} step={10} defaultValue={0} className="input" />
            </div>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <Toggle name="frontDoor" label="Front door" defaultChecked />
              <Toggle name="trimOnly" label="Trim only, not siding" />
              <Toggle name="premiumPaint" label="Premium paint" />
            </div>
          </div>
        )}
        {err("scope")}
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="mb-2 text-h3 wdth-104">3. Where should we send it?</legend>
        <p className="-mt-2 text-small text-graphite">
          We&rsquo;ll email your price range{hasPhoto ? " and your room preview" : ""}. No calls unless you ask for them below.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="field">
            <label className="field-label" htmlFor={`${id}-name`}>Name</label>
            <input id={`${id}-name`} name="name" className="input" autoComplete="name" required defaultValue={v.name} {...aria("name")} />
            {err("name")}
          </div>
          <div className="field">
            <label className="field-label" htmlFor={`${id}-email`}>Email</label>
            <input id={`${id}-email`} name="email" type="email" className="input" autoComplete="email" required defaultValue={v.email} {...aria("email")} />
            {err("email")}
          </div>
          <div className="field">
            <label className="field-label" htmlFor={`${id}-zip`}>ZIP <span className="text-graphite">(optional)</span></label>
            <input id={`${id}-zip`} name="zip" className="input" inputMode="numeric" maxLength={5} autoComplete="postal-code" placeholder="68046" defaultValue={v.zip} {...aria("zip")} />
            {err("zip")}
          </div>
          <div className="field">
            <label className="field-label" htmlFor={`${id}-phone`}>Phone <span className="text-graphite">(only if you want a call)</span></label>
            <input id={`${id}-phone`} name="phone" type="tel" className="input" autoComplete="tel" defaultValue={v.phone} {...aria("phone")} />
            {err("phone")}
          </div>
        </div>
        <label className="flex items-start gap-3 text-small">
          <input type="checkbox" name="contactMe" className="mt-1 h-4 w-4 flex-none accent-[var(--color-tape)]" />
          <span>
            Also have one local painter contact me for a free on-site quote.
            {hasPhoto ? " My room preview will be shared with them." : ""}
          </span>
        </label>
        {err("photo")}
      </fieldset>

      {state.status === "error" && state.message ? <p role="alert" className="field-error">{state.message}</p> : null}

      <div className="grid gap-4">
        <button type="submit" className="btn btn-primary justify-self-start" disabled={pending} data-magnetic="">
          {pending ? "Calculating…" : "Email me my estimate"} <span className="arrow" aria-hidden="true">→</span>
        </button>
        <p className="text-small text-graphite">
          A planning range from published pricing data, not a quote. Papillion Painters is a referral service, not a
          painting company. See our <Link className="underline" href="/privacy">privacy page</Link>.
        </p>
      </div>
    </form>
  );
}

function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="choice">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      <span>{label}</span>
    </label>
  );
}
