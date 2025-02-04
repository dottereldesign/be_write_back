// src/components/PasteContainer.tsx
import { useState, useEffect } from "react";
import NameModal from "./NameModal";
import SortButtons from "./SortButtons";
import Toast from "./Toast";
import "./PasteContainer.css";

interface PastedItem {
  text: string;
  timestamp: string;
  displayName: string;
}

const PasteContainer = () => {
  const [pastedTexts, setPastedTexts] = useState<PastedItem[]>([]);
  const [newPaste, setNewPaste] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [sortType, setSortType] = useState<"name" | "date">("date");
  const [isAscending, setIsAscending] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  // ✅ Paste Event Listener
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const pastedText = event.clipboardData?.getData("text");
      if (pastedText) {
        setNewPaste(pastedText);
        setShowModal(true);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showModal) {
        setShowModal(false);
      }
    };

    document.addEventListener("paste", handlePaste);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal]);

  // ✅ Save a Pasted Item
  const handleSaveName = (name: string) => {
    if (!newPaste) return;

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

    setNewPaste(null);
    setShowModal(false);
  };

  // ✅ Copy Text to Clipboard
  const copyToClipboard = (text: string, displayName: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log("📋 [PasteContainer] Copying:", displayName);
      setToastMessage(`Copied contents of "${displayName}" to clipboard!`);
      setShowToast(true);

      // ✅ Automatically hide after 2.5s
      setTimeout(() => {
        console.log("🕒 [PasteContainer] Hiding Toast...");
        setShowToast(false);
      }, 2500);
    });
  };

  // ✅ Sorting Logic (FIXED)
  const sortedTexts = [...pastedTexts].slice().sort((a, b) => {
    if (sortType === "name") {
      return isAscending
        ? a.displayName.localeCompare(b.displayName)
        : b.displayName.localeCompare(a.displayName);
    } else {
      return isAscending
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  // ✅ Debug Sorting Updates
  useEffect(() => {
    console.log("🔄 Sorting Updated:", { sortType, isAscending });
  }, [sortType, isAscending]);

  // ✅ Animate Cards Appearing
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleCards(new Set(sortedTexts.map((_, i) => i)));
    }, 50);
    return () => clearTimeout(timer);
  }, [sortedTexts]);

  return (
    <div>
      {showModal && (
        <NameModal
          key={newPaste ? `modal-${newPaste}` : "modal"}
          isOpen={showModal}
          pastedText={newPaste}
          onSave={handleSaveName}
          onClose={() => setShowModal(false)}
        />
      )}

      <SortButtons
        setSortType={setSortType}
        setIsAscending={setIsAscending}
        isAscending={isAscending}
        sortType={sortType}
      />

      <div className="paste-container">
        {sortedTexts.map((item, index) => (
          <div
            key={index}
            className={`paste-card ${visibleCards.has(index) ? "show" : ""}`}
          >
            <div className="timestamp">{item.timestamp}</div>
            <div
              className="copy-icon"
              onClick={() => copyToClipboard(item.text, item.displayName)}
            >
              📋
            </div>
            <div className="pasted-text">{item.displayName}</div>
          </div>
        ))}
      </div>

      {showToast && toastMessage && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default PasteContainer;
