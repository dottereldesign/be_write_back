// src/components/Header.tsx
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import clipboardImg from "../assets/clipboard-img.png"; // ✅ Import the image
import "../styles/Header.css"; // ✅ Import the CSS

const Header = () => {
  const [isOpen, setIsOpen] = useState(true); // ✅ Default state set to OPEN

  return (
    <header className="app-header">
      {/* 🔹 Main Title */}
      <div className="title-container">
        <h1 className="app-title">bewriteback</h1>
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
          <span className="step-number">Step 1</span>
          <br></br>
          <p>Paste Text using ctrl+v (or cmd+v on Mac).</p>
          <span className="step-number">Step 2</span> <br></br>
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
