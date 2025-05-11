// src/components/Board/NameModal.tsx
import { useState, useEffect, useRef, memo } from "react";
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

  useModalKeyboardShortcuts({
    isOpen,
    onCancel: onClose,
    onConfirm: handleSave,
  });

  useEffect(() => {
    if (isOpen) {
      setName("");
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen, pastedText]);

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
        <h2 id="modal-title">Name your paste</h2>
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
          aria-label="Paste name input"
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
