// src/components/NameModal.tsx
import { useState, useEffect } from "react";
import "./NameModal.css";

interface NameModalProps {
  onSave: (name: string) => void;
  onClose: () => void;
  isOpen: boolean;
  pastedText: string | null; // 🔹 Add pastedText prop
}

const NameModal = ({ onSave, onClose, isOpen, pastedText }: NameModalProps) => {
  const [name, setName] = useState(""); // ✅ Should start empty

  // 🔹 Reset name field every time modal opens or pastedText changes
  useEffect(() => {
    if (isOpen) {
      console.log("🟢 MODAL OPENED. Resetting name field.");
      setTimeout(() => setName(""), 0); // 🔹 Force reset with slight delay
    }
  }, [isOpen, pastedText]); // ✅ Runs every time modal opens or pasted text changes

  const handleSave = () => {
    console.log("✅ SAVING NAME:", name);
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      console.log("⌨️ ENTER PRESSED: Saving name.");
      handleSave();
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
          onChange={(e) => {
            console.log("✏️ Previous Input Value:", name);
            console.log("✏️ New Input Value:", e.target.value);
            setName(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          autoFocus
          autoComplete="off"
          spellCheck="false"
        />

        <div className="modal-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default NameModal;
