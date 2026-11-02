import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from "./components/errorBoundary.jsx";
import { reportFrontendErrorToHealix } from "./utils/healixLogger.js";

// Global listener for unhandled async promise errors in frontend
window.addEventListener("unhandledrejection", (event) => {
  const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
  reportFrontendErrorToHealix({
    serviceName: "blood-donation-frontend",
    error,
  });
});

// Global listener for generic window script errors
window.addEventListener("error", (event) => {
  if (event.error) {
    reportFrontendErrorToHealix({
      serviceName: "blood-donation-frontend",
      error: event.error,
    });
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
)
