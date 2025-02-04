// src/components/Header.tsx
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import clipboardImg from "../assets/clipboard-img.png"; // ✅ Import the image
import "./Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="app-header">
      {/* 🔹 Main Title */}
      <div className="title-container">
        <h1 className="app-title">brb, saving that</h1>
        <span className="subtitle-jp">書いて戻ります</span>
      </div>

      {/* 🔹 Accordion Toggle Button */}
      <button className="accordion-toggle" onClick={() => setIsOpen(!isOpen)}>
        How does this work?{" "}
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      </button>

      {/* 🔹 Accordion Content */}
      {isOpen && (
        <div className="instructions">
          <p>
            Copy any text, then press <strong>Ctrl + V</strong> (or{" "}
            <strong>Cmd + V</strong> on Mac) on this screen to save it.
          </p>
          <p>
            Name your saved text in the pop-up, and it will be stored below.
          </p>
          <p>Click the clipboard icon to copy the original text anytime.</p>

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
