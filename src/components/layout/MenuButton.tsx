"use client";

import Image from "next/image";

type MenuButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

export default function MenuButton({ isOpen, onClick }: MenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls="mobile-navigation"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      className="relative z-50 flex items-center gap-2 font-mono text-sm uppercase tracking-wide text-ink transition-colors hover:text-accent"
    >
      <Image
        src={isOpen ? "/images/close-icon.svg" : "/images/menu-icon.svg"}
        alt=""
        width={18}
        height={18}
      />
      {isOpen ? "Close" : "Menu"}
    </button>
  );
}