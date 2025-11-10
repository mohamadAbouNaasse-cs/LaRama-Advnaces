/**
 * Application Entry Point - LaRama Frontend
 * Initializes React application and mounts it to the DOM
 * Configures React StrictMode for development assistance
 */

import React from "react";
import { createRoot } from 'react-dom/client'
import "./index.css"; // Global CSS imports including Tailwind base styles
import App from "./App"; // Main application component

// Create React root and render application
// StrictMode enables additional development checks and warnings
const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);