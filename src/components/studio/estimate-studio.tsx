"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useCallback, useEffect, useId, useRef, useState } from "react";
import { submitEstimate, type FormState } from "@/app/actions";
import { conditionLabels, roomSizeLabels, sidingLabels, usd, type Scope } from "@/lib/estimate";
import { visualizerSampleHouse } from "@/content/images";
import { setQuotePrefill } from "@/lib/quote-prefill";
import { Honeypot } from "../ui";
import type { Recolor } from "./recolor";

/** The six brand colors. Our own names: these are not any paint brand's colors. */
const SWATCHES = [
  { name: "Platte Navy", hex: "#1f2a4d" },
  { name: "Prairie Green", hex: "#2f5b46" },
  { name: "Sage Field", hex: "#7a8b6f" },
  { name: "Wheat Straw", hex: "#c9b79c" },
  { name: "Wet Ochre", hex: "#e2a83c" },
  { name: "Dusk Plum", hex: "#2e1f2e" },
];

const SURFACES = ["Interior walls", "Exterior", "Trim", "Cabinets", "Front door"] as const;
type Surface = (typeof SURFACES)[number];

const SAMPLES = {
  room: { src: "/visualizer/sample-room.svg", label: "sample room", surface: "Interior walls" as Surface, scope: "interior" as Scope },
  house: { src: visualizerSampleHouse, label: "sample house", surface: "Exterior" as Surface, scope: "exterior" as Scope },
};

type Color = { name: string; hex: string };
type Source = "none" | "sample" | "upload";
type Tool = "fill" | "brush" | "erase";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function EstimateStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const engineRef = useRef<Recolor | null>(null);
  const photoBlob = useRef<Blob | null>(null);

  const [source, setSource] = useState<Source>("none");
  const [loading, setLoading] = useState(false);
  const [painted, setPainted] = useState(0);
  const [canUndo, setCanUndo] = useState(false);
  const [activeId, setActiveId] = useState(0);
  const [color, setColor] = useState<Color>(SWATCHES[2]);
  const [tolerance, setTolerance] = useState(16);
  const [split, setSplit] = useState(0);
  const [tool, setTool] = useState<Tool>("fill");
  const [brushSize, setBrushSize] = useState(24);
  const [surface, setSurface] = useState<Surface>("Interior walls");
  const [hint, setHint] = useState("");
  const [scope, setScope] = useState<Scope>("interior");
  const [formKey, setFormKey] = useState(0);
  const [cursor, setCursor] = useState({ fx: 0.5, fy: 0.5 });
  const [keyboard, setKeyboard] = useState(false);
  const pendingTap = useRef<{ fx: number; fy: number } | null>(null);
  const stroke = useRef<{ last: { x: number; y: number } } | null>(null);
  const frame = useRef(0);

  const redraw = useCallback(() => {
    const engine = engineRef.current;
    const ctx = canvasRef.current?.getContext("2d");
    if (engine && ctx) engine.render(ctx, split);
  }, [split]);
  useEffect(redraw, [redraw]);

  /** Brush strokes re-render at most once per frame. */
  const scheduleRedraw = () => {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      redraw();
    });
  };
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const sync = () => {
    const engine = engineRef.current;
    setPainted(engine?.regionCount ?? 0);
    setCanUndo(engine?.canUndo ?? false);
  };

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
  }, [source, painted, color, activeId, canUndo]);

  /** Fill (or select) at a point given as a fraction of the image. */
  const fillAt = useCallback(
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
        if (hex) setColor(match ?? { name: `Custom color ${hex}`, hex });
        setHint("Surface selected. Pick a color to change it.");
        return;
      }
      const id = engine.fill(x, y, color.hex, tolerance);
      if (!id) {
        setHint("That spot is too small to be a surface. Tap a larger area, raise the edge sensitivity, or use the brush.");
        return;
      }
      setHint("");
      setActiveId(id);
      sync();
      redraw();
    },
    [color.hex, tolerance, redraw],
  );
  const fillAtRef = useRef(fillAt);
  useEffect(() => {
    fillAtRef.current = fillAt;
  }, [fillAt]);

  const load = useCallback(async (input: File | string, kind: Source, sample?: keyof typeof SAMPLES) => {
    setLoading(true);
    setHint("");
    try {
      const { Recolor, loadImage } = await import("./recolor");
      const img = await loadImage(input); // respects phone EXIF rotation
      const engine = new Recolor(img as CanvasImageSource & { width: number; height: number }); // ≤ 1600px
      engineRef.current = engine;
      const canvas = canvasRef.current!;
      canvas.width = engine.w;
      canvas.height = engine.h;
      engine.render(canvas.getContext("2d")!, 0);
      setSplit(0);
      setActiveId(0);
      setSource(kind);
      sync();
      if (sample) {
        setSurface(SAMPLES[sample].surface);
        setScope(SAMPLES[sample].scope);
      }
      if (pendingTap.current) {
        const { fx, fy } = pendingTap.current;
        pendingTap.current = null;
        requestAnimationFrame(() => fillAtRef.current(fx, fy));
      }
    } catch {
      setHint("We couldn't open that image. Try a JPG or PNG photo.");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------- pointer: fill on tap, brush/eraser on drag ---------- */
  const fraction = (e: { clientX: number; clientY: number }) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { fx: (e.clientX - r.left) / r.width, fy: (e.clientY - r.top) / r.height };
  };
  const radiusPx = () => {
    const engine = engineRef.current!;
    const r = canvasRef.current!.getBoundingClientRect();
    return (brushSize / 2) * (engine.w / r.width);
  };
  const startStroke = () => {
    const engine = engineRef.current;
    if (!engine) return false;
    const id = engine.beginStroke(tool === "erase" ? "erase" : "paint", activeId, color.hex);
    if (tool !== "erase" && !id) return false;
    return true;
  };
  const finishStroke = () => {
    const engine = engineRef.current;
    if (!engine) return;
    const id = engine.endStroke();
    if (id) setActiveId(id);
    sync();
    redraw();
  };
  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setKeyboard(false);
    const engine = engineRef.current;
    if (tool === "fill" || !engine || !startStroke()) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const { fx, fy } = fraction(e);
    const p = { x: fx * engine.w, y: fy * engine.h };
    engine.brush(p.x, p.y, radiusPx());
    stroke.current = { last: p };
    scheduleRedraw();
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const engine = engineRef.current;
    if (!stroke.current || !engine) return;
    const { fx, fy } = fraction(e);
    const p = { x: fx * engine.w, y: fy * engine.h };
    const r = radiusPx();
    // Stamp along the segment so fast drags leave no gaps.
    const { last } = stroke.current;
    const d = Math.hypot(p.x - last.x, p.y - last.y);
    const steps = Math.max(1, Math.ceil(d / Math.max(1, r * 0.4)));
    for (let i = 1; i <= steps; i++) engine.brush(last.x + ((p.x - last.x) * i) / steps, last.y + ((p.y - last.y) * i) / steps, r);
    stroke.current.last = p;
    scheduleRedraw();
  };
  const onPointerUp = () => {
    if (!stroke.current) return;
    stroke.current = null;
    finishStroke();
  };
  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== "fill") return;
    const { fx, fy } = fraction(e);
    fillAt(fx, fy);
  };

  /* ---------- keyboard: arrows move a crosshair, Enter/Space acts ---------- */
  const actAtCursor = () => {
    if (tool === "fill") return fillAt(cursor.fx, cursor.fy);
    const engine = engineRef.current;
    if (!engine || !startStroke()) return;
    engine.brush(cursor.fx * engine.w, cursor.fy * engine.h, radiusPx());
    finishStroke();
  };
  const onCanvasKey = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    const step = e.shiftKey ? 0.08 : 0.02;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key]) {
      e.preventDefault();
      setKeyboard(true);
      const [dx, dy] = moves[e.key];
      setCursor((c) => ({ fx: Math.min(0.99, Math.max(0.01, c.fx + dx)), fy: Math.min(0.99, Math.max(0.01, c.fy + dy)) }));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setKeyboard(true);
      actAtCursor();
    }
  };

  const pickColor = (c: Color) => {
    setColor(c);
    const engine = engineRef.current;
    if (engine && activeId) {
      engine.setColor(activeId, c.hex);
      redraw();
      sync();
    }
  };

  const undo = () => {
    const engine = engineRef.current;
    if (!engine) return;
    setActiveId(engine.undo());
    sync();
    redraw();
  };
  const reset = () => {
    engineRef.current?.reset();
    setActiveId(0);
    sync();
    redraw();
  };

  const download = async () => {
    const blob = await engineRef.current?.toBlob(0.9);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "papillion-painters-color-preview.jpg";
    document.body.append(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  /** Hand the color (and, for the visitor's own photo, the preview) to the quote form. */
  const quoteThisColor = async () => {
    let photo: File | undefined;
    if (source === "upload") {
      const blob = await engineRef.current?.toBlob(0.85);
      if (blob) photo = new File([blob], "color-preview.jpg", { type: "image/jpeg" });
    }
    setQuotePrefill({ note: `${surface}, ${color.name}`, photo });
    document.getElementById("quote")?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  };

  const swatchName = useId();
  const surfaceName = useId();
  const toolName = useId();

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      {/* ---------------- Visualizer ---------------- */}
      <div className="grid content-start gap-4 lg:col-span-7">
        <div className="relative overflow-hidden bg-primer-deep">
          <canvas
            ref={canvasRef}
            tabIndex={source === "none" ? -1 : 0}
            onClick={onCanvasClick}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onCanvasKey}
            onBlur={() => setKeyboard(false)}
            className={`block h-auto w-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape ${
              tool === "fill" ? "cursor-crosshair touch-manipulation" : "cursor-cell touch-none"
            } ${source === "none" ? "hidden" : ""}`}
            role="application"
            aria-roledescription="color preview"
            aria-label={`Photo preview. ${painted} area${painted === 1 ? "" : "s"} painted. Tool: ${tool === "fill" ? "fill" : tool === "brush" ? "brush" : "eraser"}. Use arrow keys to move the crosshair and Enter to ${tool === "fill" ? "paint the surface under it" : tool === "brush" ? "brush" : "erase"} with ${color.name}.`}
          />
          {keyboard && source !== "none" ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_2px_var(--color-ink)]"
              style={{ left: `${cursor.fx * 100}%`, top: `${cursor.fy * 100}%` }}
            />
          ) : null}
          {source === "none" ? (
            <button
              type="button"
              className="group relative block w-full cursor-crosshair text-left"
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                // Keyboard "clicks" have no position: start without a tap.
                if (e.detail > 0) pendingTap.current = { fx: (e.clientX - r.left) / r.width, fy: (e.clientY - r.top) / r.height };
                load(SAMPLES.house.src, "sample", "house");
              }}
              aria-label="Try the visualizer on a sample house"
            >
              <Image src={SAMPLES.house.src} alt="" width={1344} height={752} sizes="(min-width: 1024px) 55vw, 100vw" className="block h-auto w-full" />
              <span className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-3 bg-chalk/95 px-4 py-3 text-small">
                <span className="font-semibold">Tap the siding to try a color</span>
                <span className="text-graphite">Sample house · or use your own photo below</span>
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
            {source === "upload" ? "Use a different photo" : "Upload or take a photo"}
          </button>
          {/* No `capture` attribute: phones offer both the camera and the photo library. */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) load(f, "upload");
              e.target.value = "";
            }}
          />
          <button type="button" className="tlink tap text-small" onClick={() => load(SAMPLES.house.src, "sample", "house")}>
            Sample house
          </button>
          <button type="button" className="tlink tap text-small" onClick={() => load(SAMPLES.room.src, "sample", "room")}>
            Sample room
          </button>
        </div>

        {source !== "none" ? (
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <fieldset className="flex flex-wrap items-center gap-2">
                <legend className="sr-only">Tool</legend>
                {(
                  [
                    ["fill", "Fill"],
                    ["brush", "Brush"],
                    ["erase", "Eraser"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="choice">
                    <input type="radio" name={toolName} checked={tool === key} onChange={() => setTool(key)} />
                    <span>{label}</span>
                  </label>
                ))}
              </fieldset>
              <button type="button" className="tlink text-small disabled:opacity-40" onClick={undo} disabled={!canUndo}>
                Undo
              </button>
              {painted > 0 ? (
                <button type="button" className="tlink tap text-small" onClick={reset}>
                  Clear all
                </button>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="field">
                <span className="field-label">Before / after</span>
                <input type="range" min={0} max={100} value={Math.round(split * 100)} onChange={(e) => setSplit(Number(e.target.value) / 100)} className="accent-[var(--color-ink)]" />
              </label>
              {tool === "fill" ? (
                <label className="field">
                  <span className="field-label">Tolerance (raise it if the paint stops short)</span>
                  <input type="range" min={6} max={34} value={tolerance} onChange={(e) => setTolerance(Number(e.target.value))} className="accent-[var(--color-ink)]" />
                </label>
              ) : (
                <label className="field">
                  <span className="field-label">Brush size</span>
                  <input type="range" min={8} max={64} value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="accent-[var(--color-ink)]" />
                </label>
              )}
            </div>
          </div>
        ) : null}

        <p className="min-h-6 text-small text-graphite" aria-live="polite">
          {hint ||
            (source === "none"
              ? "Your photo stays on your device unless you send it."
              : tool === "brush"
                ? "Drag to add paint where the fill missed. It adds to the selected surface."
                : tool === "erase"
                  ? "Drag to remove paint that spilled onto trim, furniture or sky."
                  : painted === 0
                    ? "Tap a surface to paint it. Tap more to add them, or tap a painted one to change its color."
                    : `${painted} area${painted === 1 ? "" : "s"} painted. Pick a color to change the selected one.`)}
        </p>

        {source !== "none" ? (
          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
            <button type="button" className="btn btn-ghost min-h-11 px-5 py-2.5 text-small" onClick={download} disabled={painted === 0}>
              Download
            </button>
            <button type="button" className="btn btn-primary min-h-11 px-5 py-2.5 text-small" onClick={quoteThisColor}>
              Get a quote for this color <span className="arrow" aria-hidden="true">→</span>
            </button>
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
          <div className="grid grid-cols-6 gap-2">
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
              onChange={(e) => pickColor({ name: `Custom color ${e.target.value}`, hex: e.target.value })}
              className="h-10 w-14 cursor-pointer border border-line bg-chalk p-1"
            />
            Or match any color (paste a paint chip&rsquo;s color code)
          </label>
        </fieldset>

        <fieldset className="grid gap-3">
          <legend className="field-label mb-3">What are you painting?</legend>
          <div className="flex flex-wrap gap-2">
            {SURFACES.map((s) => (
              <label key={s} className="choice">
                <input type="radio" name={surfaceName} checked={surface === s} onChange={() => setSurface(s)} />
                <span>{s}</span>
              </label>
            ))}
          </div>
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
          <button type="button" className="tlink tap text-small" onClick={onRestart}>Build another estimate</button>
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
