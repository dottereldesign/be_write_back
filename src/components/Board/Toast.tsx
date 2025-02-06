// src/components/Board/Toast.tsx
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../styles/Toast.css";

interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

const Toast = ({ message, onClose }: ToastProps) => {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    console.log("🟢 [Toast] Checking for new message:", message);
    if (!message) {
      console.log("⚠️ [Toast] No message received. Exiting...");
      return;
    }

    console.log("🔵 [Toast] New message received:", message);
    setVisible(true);
    setFadeOut(false);

    console.log("🟢 [Toast] Toast is now visible.");

    const fadeOutTimer = setTimeout(() => {
      console.log("🟠 [Toast] Starting fade-out...");
      setFadeOut(true);
    }, 2000);

    const removeToastTimer = setTimeout(() => {
      console.log("🔴 [Toast] Removing toast from UI.");
      setVisible(false);
      if (onClose) {
        console.log("🚀 [Toast] Calling onClose()");
        onClose();
      }
    }, 2500);

    return () => {
      console.log("⚪ [Toast] Cleanup: Clearing timers.");
      clearTimeout(fadeOutTimer);
      clearTimeout(removeToastTimer);
    };
  }, [message, onClose]);

  console.log(
    "🎭 [Toast] Render State - visible:",
    visible,
    "fadeOut:",
    fadeOut
  );

  return visible ? (
    <div className={`toast ${fadeOut ? "hide" : "show"}`}>
      {/* ✅ Green Tick Circle */}
      <div className="toast-icon">
        <FontAwesomeIcon icon={faCheck} />
      </div>

      {/* ✅ Message */}
      <span className="toast-message">{message}</span>

      {/* ✅ Close Button (Top Right) */}
      <button
        className="toast-close"
        onClick={() => {
          console.log("❌ [Toast] Close button clicked!");
          setFadeOut(true);
          setTimeout(() => {
            setVisible(false);
            if (onClose) {
              console.log("🚀 [Toast] Calling onClose() from close button");
              onClose();
            }
          }, 500);
        }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  ) : null;
};

export default Toast;
