// src/components/Board/NameModal.tsx
import { useState, useEffect, useRef, memo } from "react";
import "../../styles/NameModal.css";
import { useModalKeyboardShortcuts } from "../../hooks/useModalKeyboardShortcuts";

interface NameModalProps {
  onSave: (name: string) => void;
  onClose: () => void;
  isOpen: boolean;
  pastedText?: string | null;
  label?: string; // For folders, etc.
}

const NameModal = ({
  onSave,
  onClose,
  isOpen,
  pastedText,
  label,
}: NameModalProps) => {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  useModalKeyboardShortcuts({
    isOpen,
    onCancel: onClose,
    onConfirm: handleSave,
  });

  // Focus trap and restore
  useEffect(() => {
    if (isOpen) {
      lastFocusedElement.current = document.activeElement as HTMLElement;
      setName("");
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
    return () => {
      if (!isOpen && lastFocusedElement.current) {
        lastFocusedElement.current.focus();
      }
    };
  }, [isOpen, pastedText]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  // Trap focus inside modal (very basic version)
  useEffect(() => {
    if (!isOpen) return;
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const node = modalRef.current;
      if (!node) return;
      const focusableEls = node.querySelectorAll<HTMLElement>(
        'input,button,[tabindex]:not([tabindex="-1"])'
      );
      if (focusableEls.length === 0) return;
      const first = focusableEls[0],
        last = focusableEls[focusableEls.length - 1];
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
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [isOpen]);

  function handleSave() {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content" ref={modalRef}>
        <h2 id="modal-title">{label || "Name your paste"}</h2>
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter a name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") onClose();
          }}
          autoComplete="off"
          spellCheck="false"
          aria-label="Name input"
        />
        <div className="modal-buttons">
          <button onClick={handleSave}>Save (Enter)</button>
          <button onClick={onClose}>Cancel (Esc)</button>
        </div>
      </div>
    </div>
  );
};

export default memo(NameModal);
