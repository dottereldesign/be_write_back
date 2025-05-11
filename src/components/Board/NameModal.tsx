// src/components/Board/NameModal.tsx
import { useState, useEffect, useRef } from "react";
import "../../styles/NameModal.css";
import { useModalKeyboardShortcuts } from "../../hooks/useModalKeyboardShortcuts";

interface NameModalProps {
  onSave: (name: string) => void;
  onClose: () => void;
  isOpen: boolean;
  pastedText: string | null;
}

const NameModal = ({ onSave, onClose, isOpen, pastedText }: NameModalProps) => {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useModalKeyboardShortcuts({ onCancel: onClose });

  useEffect(() => {
    if (isOpen) {
      setName("");
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen, pastedText]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab" && modalRef.current) {
        const focusableElements =
          modalRef.current.querySelectorAll<HTMLElement>(
            'input, button, [href], select, textarea, [tabindex]:not([tabindex="-1"])'
          );
        if (!focusableElements.length) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (!first || !last) return;

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
      >
        <h2 id="modal-title">Name your paste</h2>
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter a name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSave();
            if (event.key === "Escape") onClose(); // Allow Esc inside input too ✅
          }}
          autoComplete="off"
          spellCheck="false"
        />
        <div className="modal-buttons">
          <button onClick={handleSave}>Save (Enter)</button>
          <button onClick={onClose}>Cancel (Esc)</button>
        </div>
      </div>
    </div>
  );
};

export default NameModal;
