// src/components/Header.tsx
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import clipboardImg from "../assets/clipboard-img.png"; // ✅ Import the image
import "../styles/Header.css"; // ✅ Import the CSS

const STORAGE_KEY = "instructionsVisibility";

const Header = () => {
  // ✅ Retrieve the stored visibility state from localStorage (default to true if null)
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState === null ? true : JSON.parse(savedState);
  });

  // ✅ Update localStorage when the state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(isOpen));
  }, [isOpen]);

  return (
    <header className="app-header">
      {/* 🔹 Main Title */}
      <div className="title-container">
        <div className="title-wrapper">
          <h1 className="app-title">bewriteback</h1>
          <span className="subtitle-jp">書いて戻ります</span>
        </div>
        <p className="tagline">Quickly save and recall copied text</p>{" "}
        {/* ✅ Add tagline */}
      </div>

      {/* 🔹 Accordion Toggle Button */}
      <button className="accordion-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Hide instructions" : "How does it work?"}{" "}
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      </button>

      {/* 🔹 Accordion Content (Stored Visibility) */}
      {isOpen && (
        <div className="instructions">
          <span className="step-number">Step 1</span>
          <p>Paste Text using ctrl+v (or cmd+v on Mac).</p>

          <span className="step-number">Step 2</span>
          <p>Name your saved text in the pop-up, it will be stored below.</p>

          <span className="step-number">Step 3</span>
          <p>Copy it again by clicking anywhere on the card.</p>

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
