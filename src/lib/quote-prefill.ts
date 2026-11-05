"use client";

import { useSyncExternalStore } from "react";

/**
 * A tiny in-memory channel from the color visualizer to the quote form on
 * the same page: "Get a quote for this color" puts the color and surface in
 * the form's Note and offers to attach the preview. Nothing leaves the
 * browser unless the visitor submits the form with the box ticked.
 */
export type QuotePrefill = {
  /** Increments on every hand-off, so the form re-applies it. */
  seq: number;
  note: string;
  /** The recolored preview, only for the visitor's own uploaded photo. */
  photo?: File;
  /** Object URL for the thumbnail next to the attach checkbox. */
  previewUrl?: string;
};

let current: QuotePrefill | null = null;
const listeners = new Set<() => void>();

export function setQuotePrefill(next: { note: string; photo?: File }) {
  if (current?.previewUrl) URL.revokeObjectURL(current.previewUrl);
  current = {
    seq: (current?.seq ?? 0) + 1,
    note: next.note,
    photo: next.photo,
    previewUrl: next.photo ? URL.createObjectURL(next.photo) : undefined,
  };
  listeners.forEach((fn) => fn());
}

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export function useQuotePrefill(): QuotePrefill | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}
