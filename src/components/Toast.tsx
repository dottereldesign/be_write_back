// src/components/Toast.tsx
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Toast.css";

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast = ({ message, onClose }: ToastProps) => {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
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
      onClose();
    }, 2500);

    return () => {
      console.log("⚪ [Toast] Cleanup: Clearing timers.");
      clearTimeout(fadeOutTimer);
      clearTimeout(removeToastTimer);
    };
  }, [message, onClose]);

  return visible ? (
    <div className={`toast ${fadeOut ? "hide" : "show"}`}>
      {/* ✅ Green Tick Circle */}
      <div className="toast-icon">
        <FontAwesomeIcon icon={faCheckCircle} />
      </div>

      {/* ✅ Message */}
      <span className="toast-message">{message}</span>

      {/* ✅ Close Button (Top Right) */}
      <button className="toast-close" onClick={onClose}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  ) : null;
};

export default Toast;
