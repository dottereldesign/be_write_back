// src/components/NameModal.tsx
import { useState, useEffect } from "react";
import "./NameModal.css";

interface NameModalProps {
  onSave: (name: string) => void;
  onClose: () => void;
  isOpen: boolean;
  pastedText: string | null;
}

const NameModal = ({ onSave, onClose, isOpen, pastedText }: NameModalProps) => {
  const [name, setName] = useState(""); // ✅ Should start empty

  // 🔹 Reset name field every time modal opens or pastedText changes
  useEffect(() => {
    if (isOpen) {
      console.log("🟢 MODAL OPENED. Resetting name field.");
      setTimeout(() => setName(""), 0); // 🔹 Force reset with slight delay
    }
  }, [isOpen, pastedText]);

  // 🔹 Handle Escape Key to Close Modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        console.log("❌ ESCAPE PRESSED: Closing modal.");
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleSave = () => {
    console.log("✅ SAVING NAME:", name);
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Name</h2>
        <input
          type="text"
          placeholder="Enter a name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSave();
          }}
          autoFocus
          autoComplete="off"
          spellCheck="false"
        />
        <div className="modal-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel (Esc)</button>
        </div>
      </div>
    </div>
  );
};

export default NameModal;
