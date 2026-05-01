import { useEffect, useState } from "react";

type ProbeState = {
  pointerCount: number;
  clickCount: number;
  keyCount: number;
  lastEvent: string;
};

const INITIAL_STATE: ProbeState = {
  pointerCount: 0,
  clickCount: 0,
  keyCount: 0,
  lastEvent: "waiting",
};

function describeTarget(target: EventTarget | null): string {
  if (!(target instanceof HTMLElement)) {
    return "unknown";
  }

  const id = target.id ? `#${target.id}` : "";
  const className = typeof target.className === "string" && target.className ? `.${target.className.split(/\s+/).join(".")}` : "";
  return `${target.tagName.toLowerCase()}${id}${className}`;
}

export default function InteractionProbe() {
  const [state, setState] = useState<ProbeState>(INITIAL_STATE);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      setState((current) => ({
        ...current,
        pointerCount: current.pointerCount + 1,
        lastEvent: `pointer ${Math.round(event.clientX)},${Math.round(event.clientY)} ${describeTarget(event.target)}`,
      }));
    }

    function onClick(event: MouseEvent) {
      setState((current) => ({
        ...current,
        clickCount: current.clickCount + 1,
        lastEvent: `click ${describeTarget(event.target)}`,
      }));
    }

    function onKeyDown(event: KeyboardEvent) {
      setState((current) => ({
        ...current,
        keyCount: current.keyCount + 1,
        lastEvent: `key ${event.key}`,
      }));
    }

    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  return (
    <output className="interaction-probe" aria-live="polite">
      pointer {state.pointerCount} · click {state.clickCount} · key {state.keyCount}
      <span>{state.lastEvent}</span>
    </output>
  );
}
