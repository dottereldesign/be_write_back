// src/hooks/useModal.ts
import { useCallback, useRef, useState } from "react";

/**
 * useModal manages open/close state and focus restore.
 */
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((e?: React.SyntheticEvent | Event) => {
    if (e && e.target instanceof HTMLElement) {
      triggerRef.current = e.target;
    }
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      triggerRef.current?.focus();
    }, 10);
  }, []);

  return { isOpen, open, close, setIsOpen, triggerRef };
}
