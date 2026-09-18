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

/*
 * `sm` is used for the desktop-only navbar chips. `md` keeps a >=44px tap
 * target, tightened only from the md breakpoint up, where it is no longer
 * being tapped with a thumb.
 */
const SIZE_CLASS: Record<Size, string> = {
  sm: "sticker--sm px-4 py-2 font-mono text-sm uppercase tracking-wide",
  md: "px-4 py-3 font-mono text-sm uppercase tracking-wide sm:px-5",
};

type SharedProps = {
  tone?: Tone;
  size?: Size;
};

/*
 * `ComponentProps<"button">` — NOT `ComponentPropsWithoutRef` — is used on
 * purpose. In React 19, function components accept `ref` as a plain prop
 * with no forwardRef required, but the type has to actually include `ref`
 * for `<StickerButton ref={...} />` to typecheck.
 * `ComponentPropsWithoutRef` strips ref from the type, which is what caused
 * the "Property 'ref' does not exist" errors.
 */
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
      className={cn("sticker", TONE_CLASS[tone], SIZE_CLASS[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}

type StickerLinkProps = SharedProps & { external?: boolean } & ComponentProps<"a">;

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
      className={cn("sticker", TONE_CLASS[tone], SIZE_CLASS[size], className)}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}
