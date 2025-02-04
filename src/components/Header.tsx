// src/components/Header.tsx
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import clipboardImg from "../assets/clipboard-img.png"; // ✅ Import the image
import "./Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(true); // ✅ Default state set to OPEN

  return (
    <header className="app-header">
      {/* 🔹 Main Title */}
      <div className="title-container">
        <h1 className="app-title">be write back</h1>
        <span className="subtitle-jp">書いて戻ります</span>
      </div>

      {/* 🔹 Accordion Toggle Button */}
      <button className="accordion-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Hide instructions" : "How does it work?"}{" "}
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      </button>

      {/* 🔹 Accordion Content (Starts Open) */}
      {isOpen && (
        <div className="instructions">
          <p>
            <strong>Step 1:</strong> Copy any text, then press{" "}
            <strong>Ctrl + V</strong> (or <strong>Cmd + V</strong> on Mac) on
            this screen to save it.
          </p>
          <p>
            <strong>Step 2:</strong> Name your saved text in the pop-up, and it
            will be stored below.
          </p>
          <p>
            <strong>Step 3:</strong> Click the clipboard icon to copy the
            original text anytime.
          </p>

          {/* 🔹 Background Glowing Spheres (Behind Image) */}
          <div className="glow-sphere sphere-1"></div>
          <div className="glow-sphere sphere-2"></div>

          {/* 🔹 Clipboard Image */}
          <img
            src={clipboardImg}
            alt="Clipboard Instructions"
            className="clipboard-img"
          />

          {/* 🔹 Foreground Glowing Spheres (Above Image) */}
          <div className="glow-sphere sphere-3"></div>
          <div className="glow-sphere sphere-4"></div>
        </div>
      )}
    </header>
  );
};

export default Header;
