// src/components/Board/ConfirmModal.tsx
import { useEffect, useRef, memo } from "react";
import "../../styles/ConfirmModal.css";
import { useModalKeyboardShortcuts } from "../../hooks/useModalKeyboardShortcuts";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ isOpen, onConfirm, onCancel }: ConfirmModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  useModalKeyboardShortcuts({ isOpen, onConfirm, onCancel });

  // Restore focus after close
  useEffect(() => {
    if (isOpen) {
      lastFocusedElement.current = document.activeElement as HTMLElement;
    }
    return () => {
      if (!isOpen && lastFocusedElement.current) {
        lastFocusedElement.current.focus();
      }
    };
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onCancel]);

  // Trap focus
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

  if (!isOpen) return null;

  return (
    <div
      className="confirm-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="confirm-modal" ref={modalRef}>
        <p id="confirm-title">
          Are you sure you want to delete all saved pastes?
        </p>
        <div className="modal-buttons">
          <button
            className="confirm-btn"
            onClick={onConfirm}
            aria-label="Confirm delete all pastes"
            type="button"
          >
            Yes, Clear All
          </button>
          <button
            className="cancel-btn"
            onClick={onCancel}
            aria-label="Cancel delete"
            type="button"
          >
            No, Keep Them
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ConfirmModal);
