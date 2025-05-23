// src/components/Header.tsx
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import clipboardImg from "../assets/clipboard-img.webp";
import logo from "/logo.webp";
import "../styles/Header.css";
import Stars from "./Stars";

const STORAGE_KEY = "instructionsVisibility";

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState === null ? true : JSON.parse(savedState);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(isOpen));
  }, [isOpen]);

  // Simpler: state-only step fade-in
  const [stepVisible, setStepVisible] = useState([false, false, false]);

  useEffect(() => {
    let timeouts: number[] = [];
    if (isOpen) {
      setStepVisible([false, false, false]);
      timeouts = [0, 1, 2].map((index) =>
        setTimeout(() => {
          setStepVisible((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });
        }, index * 400)
      );
    } else {
      setStepVisible([false, false, false]);
    }
    return () => timeouts.forEach(clearTimeout);
  }, [isOpen]);

  return (
    <header className="app-header">
      <div className="logo-wrapper">
        <img
          src={logo}
          alt="Logo"
          className="app-logo"
          width="32"
          height="32"
        />
        <div className="brand-text">
          <span className="brand-line">dotterel</span>
          <span className="brand-line">design</span>
        </div>
      </div>

      <div className="title-container">
        <div className="title-wrapper">
          <h1 className="app-title">bewriteback</h1>
          <span className="subtitle-jp">書いて戻ります</span>
        </div>
        <p className="tagline">Quickly Save and Recall Copied Notes</p>
      </div>

      <button className="accordion-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Hide instructions" : "How does it work?"}{" "}
        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
      </button>

      {isOpen && (
        <div className="instructions">
          <div className={`step-container ${stepVisible[0] ? "fade-in" : ""}`}>
            <span className="step-number">Step 1</span>
            <p>Paste text using ctrl+v (or cmd+v on Mac).</p>
          </div>
          <div className={`step-container ${stepVisible[1] ? "fade-in" : ""}`}>
            <span className="step-number">Step 2</span>
            <p>Name your saved text in the pop-up, it will be stored below.</p>
          </div>
          <div className={`step-container ${stepVisible[2] ? "fade-in" : ""}`}>
            <span className="step-number">Step 3</span>
            <p>Copy it again by clicking anywhere on the card.</p>
          </div>
          <div className="glow-sphere sphere-1"></div>
          <div className="glow-sphere sphere-2"></div>
          <div className="clipboard-container">
            <img
              src={clipboardImg}
              alt="Clipboard Instructions"
              className="clipboard-img"
            />
            <Stars />
          </div>
          <div className="glow-sphere sphere-3"></div>
          <div className="glow-sphere sphere-4"></div>
        </div>
      )}
    </header>
  );
};

export default Header;
