import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

type ClockDisplayProps = {
  dayPeriod: string;
  time: string;
  label: string;
};

const DEFAULT_MIN_FONT_SIZE = 48;
const DEFAULT_MAX_FONT_SIZE = 520;

function readNumericCssVariable(element: HTMLElement, name: string, fallback: number): number {
  const value = Number.parseFloat(getComputedStyle(element).getPropertyValue(name));
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export default function ClockDisplay({ dayPeriod, time, label }: ClockDisplayProps) {
  const displayRef = useRef<HTMLTimeElement>(null);
  const dayPeriodRef = useRef<HTMLSpanElement>(null);
  const timeValueRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState<number | null>(null);

  const fitClockToContainer = useCallback(() => {
    const display = displayRef.current;
    if (!display) {
      return;
    }

    const parent = display.parentElement;
    const minFontSize = readNumericCssVariable(display, "--clock-time-min", DEFAULT_MIN_FONT_SIZE);
    const maxFontSize = readNumericCssVariable(display, "--clock-time-max", DEFAULT_MAX_FONT_SIZE);
    const currentFontSize = readNumericCssVariable(display, "--clock-time-font-size", maxFontSize);
    const timeRect = timeValueRef.current?.getBoundingClientRect();
    const dayPeriodRect = dayPeriodRef.current?.getBoundingClientRect();
    const gap = dayPeriodRect ? readNumericCssVariable(display, "column-gap", 0) : 0;
    const measuredWidth = (timeRect?.width ?? 0) + (dayPeriodRect?.width ?? 0) + gap;
    const measuredHeight = Math.max(timeRect?.height ?? 0, dayPeriodRect?.height ?? 0);
    const availableWidth = display.clientWidth;
    const parentHeight = parent?.clientHeight ?? window.innerHeight;
    const heightShare = parent?.classList.contains("clock-main-zen") ? 0.9 : 0.58;
    const availableHeight = Math.max(minFontSize, parentHeight * heightShare);

    if (measuredWidth <= 0 || measuredHeight <= 0 || availableWidth <= 0) {
      return;
    }

    const widthFit = currentFontSize * ((availableWidth * 0.98) / measuredWidth);
    const heightFit = currentFontSize * (availableHeight / measuredHeight);
    const nextFontSize = Math.floor(clamp(Math.min(widthFit, heightFit, maxFontSize), minFontSize, maxFontSize));

    setFontSize((previousFontSize) => {
      if (previousFontSize !== null && Math.abs(previousFontSize - nextFontSize) < 1) {
        return previousFontSize;
      }

      return nextFontSize;
    });
  }, []);

  useLayoutEffect(() => {
    const display = displayRef.current;
    if (!display) {
      return;
    }

    let frameId = window.requestAnimationFrame(fitClockToContainer);
    const resizeObserver = new ResizeObserver(() => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(fitClockToContainer);
    });

    resizeObserver.observe(display);
    if (display.parentElement) {
      resizeObserver.observe(display.parentElement);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [fitClockToContainer]);

  useLayoutEffect(() => {
    fitClockToContainer();
  }, [dayPeriod, fitClockToContainer, time]);

  const style = fontSize === null ? undefined : ({ "--clock-time-font-size": `${fontSize}px` } as CSSProperties);

  return (
    <time ref={displayRef} className="clock-display" style={style} aria-live="off" aria-label={`当前时间 ${label}`}>
      {dayPeriod ? <span ref={dayPeriodRef} className="clock-day-period">{dayPeriod}</span> : null}
      <span ref={timeValueRef} className="clock-time-value">{time}</span>
    </time>
  );
}
