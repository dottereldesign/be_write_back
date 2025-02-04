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
      <h1 className="app-title">brb, saving that</h1>

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

          {/* 🔹 Clipboard Image */}
          <img
            src={clipboardImg}
            alt="Clipboard Instructions"
            className="clipboard-img"
          />
        </div>
      )}
    </header>
  );
};

export default Header;
