// src/components/Board/Toast.tsx
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../styles/Toast.css";

interface ToastProps {
  message: string | null;
  onClose?: () => void;
}

const FADE_DURATION = 500;

const Toast = ({ message, onClose }: ToastProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) setVisible(true);
    else if (visible) setVisible(false);
    // eslint-disable-next-line
  }, [message]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (!visible && message) {
      timer = setTimeout(() => {
        if (onClose) onClose();
      }, FADE_DURATION);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, message, onClose]);

  const handleManualClose = () => {
    setVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, FADE_DURATION);
  };

  if (!message && !visible) return null;

  return (
    <div className={`toast ${visible ? "show" : "hide"}`}>
      <div className="toast-icon">
        <FontAwesomeIcon icon={faCheck} />
      </div>
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={handleManualClose}
        aria-label="Close notification"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default Toast;
