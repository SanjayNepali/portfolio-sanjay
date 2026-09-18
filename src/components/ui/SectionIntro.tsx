import type { Ref } from "react";
import { cn } from "@/lib/utils/cn";

type SectionIntroProps = {
  index: string;
  title: string;
  hint?: string;
  /** `light` = paper text for dark backdrops, `dark` = ink text for sand. */
  tone?: "light" | "dark";
  className?: string;
  ref?: Ref<HTMLDivElement>;
};

/**
 * The [00X] + giant heading + scroll hint block shared by Work, In Detail,
 * About and Contact.
 */
export default function SectionIntro({
  index,
  title,
  hint,
  tone = "dark",
  className,
  ref,
}: SectionIntroProps) {
  const muted = tone === "light" ? "text-paper/80" : "text-ink/70";
  const strong = tone === "light" ? "text-paper" : "text-ink";

  return (
    <div
      ref={ref}
      className={cn("flex flex-col items-center px-6 text-center", className)}
    >
      <span
        className={cn("font-mono text-xs uppercase tracking-wide", muted)}
      >
        [ {index} ]
      </span>

      <h2
        className={cn(
          "font-sans text-[clamp(2.5rem,10vw,7.5rem)] font-semibold uppercase leading-[0.9] tracking-tight",
          strong
        )}
      >
        {title}
      </h2>

      {hint ? (
        <p className={cn("mt-2 font-mono text-xs uppercase tracking-wide", muted)}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
