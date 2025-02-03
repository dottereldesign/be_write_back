// src/components/PasteContainer.tsx
import { useState, useEffect } from "react";
import NameModal from "./NameModal";
import "./PasteContainer.css";

// Clipboard SVG icon
const ClipboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="#b0b0b0"
  >
    <path d="M19 4h-3.18C15.4 2.84 14.3 2 13 2h-2c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM9 4c0-.55.45-1 1-1h2c.55 0 1 .45 1 1v1h-4V4zm10 16H5V6h14v14z"></path>
  </svg>
);

interface PastedItem {
  text: string;
  timestamp: string;
  displayName: string;
}

const PasteContainer = () => {
  const [pastedTexts, setPastedTexts] = useState<PastedItem[]>([]);
  const [newPaste, setNewPaste] = useState<string | null>(null); // Stores pasted text before adding
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const pastedText = event.clipboardData?.getData("text");
      console.log("🔹 PASTE EVENT TRIGGERED");
      console.log("📌 Pasted text:", pastedText);

      if (pastedText) {
        console.log("🟢 Setting newPaste:", pastedText);
        setNewPaste(pastedText);
        console.log("🟢 Opening modal...");
        setShowModal(true);
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  const handleSaveName = (name: string) => {
    if (!newPaste) return;

    console.log("✅ Saving name:", name);
    console.log("📌 Associating with pasted text:", newPaste);

    const nzDate = new Intl.DateTimeFormat("en-NZ", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date());

    setPastedTexts((prev) => [
      ...prev,
      { text: newPaste, displayName: name, timestamp: nzDate },
    ]);

    console.log("🚀 Added new card to UI.");
    setNewPaste(null);
    setShowModal(false);
    console.log("🔻 Modal closed.");
  };

  // Function to copy the original pasted text
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  return (
    <div>
      {showModal && (
        <NameModal
          key={newPaste ? `modal-${newPaste}` : "modal"} // 🔹 Ensures a fresh instance
          isOpen={showModal}
          pastedText={newPaste}
          onSave={handleSaveName}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="paste-container">
        {pastedTexts.map((item, index) => (
          <div key={index} className="paste-card">
            <div className="timestamp">{item.timestamp}</div>
            <div
              className="copy-icon"
              onClick={() => copyToClipboard(item.text)}
            >
              <ClipboardIcon />
            </div>
            <div className="pasted-text">{item.displayName}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasteContainer;
