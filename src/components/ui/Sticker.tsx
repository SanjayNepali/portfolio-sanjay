import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "paper" | "invert" | "amber" | "ocean";
type Size = "sm" | "md";

const TONE_CLASS: Record<Tone, string> = {
  paper: "sticker--paper",
  invert: "sticker--invert",
  amber: "sticker--amber",
  ocean: "sticker--ocean",
};

const SIZE_CLASS: Record<Size, string> = {
  sm: "sticker--sm px-4 py-2 font-mono text-sm uppercase tracking-wide",
  md: "px-4 py-3 font-mono text-sm uppercase tracking-wide sm:px-5",
};

type SharedProps = {
  tone?: Tone;
  size?: Size;
};

type StickerButtonProps = SharedProps & ComponentProps<"button">;

export function StickerButton({
  tone = "paper",
  size = "md",
  className,
  children,
  type = "button",
  ...rest
}: StickerButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "sticker min-w-0 max-w-full",
        TONE_CLASS[tone],
        SIZE_CLASS[size],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

type StickerLinkProps = SharedProps &
  { external?: boolean } &
  ComponentProps<"a">;

export function StickerLink({
  tone = "paper",
  size = "md",
  className,
  children,
  external,
  ...rest
}: StickerLinkProps) {
  return (
    <a
      className={cn(
        "sticker min-w-0 max-w-full",
        TONE_CLASS[tone],
        SIZE_CLASS[size],
        className
      )}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}