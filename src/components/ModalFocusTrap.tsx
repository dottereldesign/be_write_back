// src/components/ModalFocusTrap.tsx
import { useEffect, useRef } from "react";

/**
 * Focus trap for modal dialogs.
 * Place this at the top of your modal's content.
 */
const FOCUSABLE = [
  "a[href]",
  "area[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
];

export default function ModalFocusTrap({
  children,
}: {
  children: React.ReactNode;
}) {
  const trapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = trapRef.current;
    if (!node) return;
    const focusableEls = node.querySelectorAll<HTMLElement>(
      FOCUSABLE.join(",")
    );
    const first = focusableEls[0],
      last = focusableEls[focusableEls.length - 1];

    function trap(e: KeyboardEvent) {
      if (e.key !== "Tab" || focusableEls.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }

    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, []);

  return <div ref={trapRef}>{children}</div>;
}
