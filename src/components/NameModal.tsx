// src/components/NameModal.tsx
import { useState } from "react";
import "./NameModal.css";

interface NameModalProps {
  onSave: (name: string) => void;
  onClose: () => void;
}

const NameModal = ({ onSave, onClose }: NameModalProps) => {
  const [name, setName] = useState("");

  const handleSave = () => {
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
