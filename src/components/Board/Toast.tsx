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

  useEffect(() => {
    if (message) {
      console.log("🟢 Showing toast with message:", message);
      setVisible(true);

      const fadeOutTimer = setTimeout(() => {
        console.log("🟠 Hiding toast");
        setVisible(false);
        if (onClose) onClose();
      }, 2000);

      return () => {
        clearTimeout(fadeOutTimer);
      };
    }
  }, [message, onClose]);

  return (
    <div className={`toast ${visible ? "show" : "hide"}`}>
      <div className="toast-icon">
        <FontAwesomeIcon icon={faCheck} />
      </div>
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={() => {
          console.log("❌ Manually closing toast");
          setVisible(false);
          if (onClose) onClose();
        }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default Toast;
