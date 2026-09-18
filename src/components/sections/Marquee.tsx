import { marqueeItems } from "@/lib/data/site";

/**
 * Server Component — zero client JavaScript. A CSS keyframe drives the
 * scroll on the compositor and stops automatically under
 * prefers-reduced-motion (see globals.css).
 */
export default function Marquee() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y-2 border-ocean bg-ink py-3 sm:py-4"
    >
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {marqueeItems.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="flex items-center whitespace-nowrap font-sans text-xl font-semibold uppercase tracking-tight text-paper sm:text-4xl"
              >
                {item}
                <span className="mx-5 text-ocean sm:mx-10">●</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
