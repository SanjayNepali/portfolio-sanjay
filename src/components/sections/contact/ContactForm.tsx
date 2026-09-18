"use client";

import { useState } from "react";
import { StickerButton } from "@/components/ui/Sticker";
import { siteConfig } from "@/lib/data/site";

const FIELD_CLASS =
  "border-2 border-ink bg-white px-4 py-3 font-sans text-base text-ink placeholder:text-ink/35 outline-none transition-colors focus:bg-sand/40 sm:text-sm";

const LABEL_CLASS = "font-mono text-xs uppercase tracking-wide text-ink/50";

/**
 * Manga-panel treatment: thick outer rule + solid black offset shadow
 * wrapping a thinner inner rule, plus a halftone screentone corner.
 * Submitting builds a mailto: link, so no backend is required.
 */
export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const subject =
      formData.subject.trim() || `Portfolio inquiry from ${formData.name}`;
    const body = `${formData.message}\n\n—\n${formData.name}\n${formData.email}`;

    setStatus("Opening your email app…");

    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="card-frame card-frame--ink relative w-full max-w-lg border-[3px] p-1.5">
      <div className="relative overflow-hidden border-2 border-ink bg-paper p-5 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 z-0 h-40 w-40 rotate-12 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-ink) 1.6px, transparent 1.6px)",
            backgroundSize: "9px 9px",
          }}
        />

        <div className="relative z-10">
          <h3 className="font-sans text-2xl font-semibold uppercase tracking-tight text-ink sm:text-3xl">
            Write me
          </h3>
          <p className="mt-2 font-sans text-sm leading-relaxed text-ink/60 sm:text-base">
            Got a project, a role, or just a question? Send it through and
            I&apos;ll get back to you.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-name" className={LABEL_CLASS}>
                  Your Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className={FIELD_CLASS}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-email" className={LABEL_CLASS}>
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="mail@company.com"
                  className={FIELD_CLASS}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-subject" className={LABEL_CLASS}>
                Subject
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="A new project, a role, a question..."
                className={FIELD_CLASS}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="contact-message" className={LABEL_CLASS}>
                The Story
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me what you're building."
                className={`${FIELD_CLASS} resize-none`}
              />
            </div>

            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <span
                className="font-mono text-[11px] uppercase tracking-wide text-ink/40"
                aria-live="polite"
              >
                {status || "Opens your email app to send"}
              </span>

              <StickerButton type="submit" tone="invert">
                Send The Letter
                <span aria-hidden="true">↗</span>
              </StickerButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
