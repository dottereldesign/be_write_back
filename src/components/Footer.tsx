// src/components/Footer.tsx
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <span className="footer-line">Built with ❤️</span>
      <span className="footer-line">
        Deployed via{" "}
        <a
          href="https://github.com/dottereldesign/be_write_back"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Repository"
        >
          <svg
            className="github-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.21.68-.47v-1.65c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.61.07-.61 1 .07 1.53 1.05 1.53 1.05.89 1.54 2.33 1.1 2.9.84.09-.64.35-1.1.63-1.35-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.99 1.03-2.69-.1-.26-.45-1.3.1-2.72 0 0 .84-.27 2.75 1.02a9.57 9.57 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.42.2 2.46.1 2.72.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.56 4.95.36.31.68.92.68 1.85v2.75c0 .26.18.56.69.47A10.002 10.002 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
          </svg>
        </a>
      </span>
      <span className="footer-line">© 2025 Jamie Wilson</span>
    </footer>
  );
};

export default Footer;
