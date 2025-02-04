// src/components/Toast.tsx
import { useEffect, useState } from "react";
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
    setVisible(true); // Show toast
    setFadeOut(false); // Reset fade-out

    console.log("🟢 [Toast] Toast is now visible.");

    const fadeOutTimer = setTimeout(() => {
      console.log("🟠 [Toast] Starting fade-out...");
      setFadeOut(true);
    }, 2000); // Start fade-out after 2 seconds

    const removeToastTimer = setTimeout(() => {
      console.log("🔴 [Toast] Removing toast from UI.");
      setVisible(false);
      onClose();
    }, 2500); // Remove toast after fade-out completes

    return () => {
      console.log("⚪ [Toast] Cleanup: Clearing timers.");
      clearTimeout(fadeOutTimer);
      clearTimeout(removeToastTimer);
    };
  }, [message, onClose]);

  return visible ? (
    <div className={`toast ${fadeOut ? "hide" : "show"}`}>{message}</div>
  ) : null;
};

export default Toast;
