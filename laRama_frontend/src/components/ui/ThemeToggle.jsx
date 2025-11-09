const ThemeToggle = ({ isDark, onToggle = () => {} }) => {
  return (
    <button
      type="button"
      className={`theme-toggle ${isDark ? "theme-toggle--dark" : ""}`}
      onClick={onToggle}
      aria-label={isDark ? "Activate light mode" : "Activate dark mode"}
    >
      <span className="theme-toggle__stars" aria-hidden="true">
        <span className="theme-toggle__star theme-toggle__star--1" />
        <span className="theme-toggle__star theme-toggle__star--2" />
        <span className="theme-toggle__star theme-toggle__star--3" />
      </span>
      <span className="theme-toggle__indicator">
        <span className="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="5" />
            <g strokeWidth="1.8" strokeLinecap="round">
              <line x1="12" y1="1.5" x2="12" y2="4.5" />
              <line x1="12" y1="19.5" x2="12" y2="22.5" />
              <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
              <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
              <line x1="1.5" y1="12" x2="4.5" y2="12" />
              <line x1="19.5" y1="12" x2="22.5" y2="12" />
              <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
              <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
            </g>
          </svg>
        </span>
        <span className="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3.25 7.25 7.25 0 1 0 21 14.5Z" />
          </svg>
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
