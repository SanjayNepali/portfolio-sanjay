"use client";

import { useEffect, useRef, useState } from "react";

const CURSOR_SIZE = 24;
const DEGREES = 57.296;

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState(false);

  // Only enable on devices with a real mouse (not touch).
  useEffect(() => {
    setIsSupported(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let previousPointerX = pointerX;
    let previousPointerY = pointerY;
    let angle = 0;
    let previousAngle = 0;
    let angleDisplace = 0;

    const applyTransform = () => {
      cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) rotate(${angleDisplace}deg)`;
    };

    applyTransform();
    cursor.style.opacity = "1";

    const rotate = (distanceX: number, distanceY: number) => {
      const unsortedAngle =
        Math.atan(Math.abs(distanceY) / Math.abs(distanceX)) * DEGREES;

      previousAngle = angle;

      if (distanceX <= 0 && distanceY >= 0) {
        angle = 90 - unsortedAngle;
      } else if (distanceX < 0 && distanceY < 0) {
        angle = unsortedAngle + 90;
      } else if (distanceX >= 0 && distanceY <= 0) {
        angle = 90 - unsortedAngle + 180;
      } else {
        angle = unsortedAngle + 270;
      }

      if (Number.isNaN(angle)) {
        angle = previousAngle;
      } else {
        const delta = angle - previousAngle;
        if (delta <= -270) {
          angleDisplace += 360 + delta;
        } else if (delta >= 270) {
          angleDisplace += delta - 360;
        } else {
          angleDisplace += delta;
        }
      }
    };

    const handleMove = (event: PointerEvent) => {
      previousPointerX = pointerX;
      previousPointerY = pointerY;
      pointerX = event.clientX;
      pointerY = event.clientY;

      const distanceX = previousPointerX - pointerX;
      const distanceY = previousPointerY - pointerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      if (distance > 1) {
        rotate(distanceX, distanceY);
      }

      applyTransform();
    };

    const handleLeave = () => {
      cursor.style.opacity = "0";
    };

    const handleEnter = () => {
      cursor.style.opacity = "1";
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerleave", handleLeave);
    window.addEventListener("pointerenter", handleEnter);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("pointerenter", handleEnter);
    };
  }, [isSupported]);

  if (!isSupported) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[2147483647] opacity-0"
      style={{
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
        marginLeft: -CURSOR_SIZE / 2,
        marginTop: -CURSOR_SIZE / 2,
        transition: "opacity 250ms, transform 100ms",
      }}
    >
      {/* Outlined paper-plane style arrow, matching Curzr's default cursor */}
      <svg
        viewBox="0 0 24 24"
        width={CURSOR_SIZE}
        height={CURSOR_SIZE}
        fill="none"
      >
        <path
          d="M2 3 L22 12 L13 14.5 L10.5 22 Z"
          stroke="var(--color-ink)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}