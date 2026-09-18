/** Minimal class-name joiner — avoids pulling in clsx for this one job. */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
