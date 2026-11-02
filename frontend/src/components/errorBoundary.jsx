// frontend/src/components/ErrorBoundary.jsx
import React from "react";
import { reportFrontendErrorToHealix } from "../utils/healixLogger";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Render Error Caught by ErrorBoundary:", error, errorInfo);

    // Dispatch incident alert to Healix
    reportFrontendErrorToHealix({
      serviceName: "blood-donation-frontend",
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center", color: "#e11d48" }}>
          <h2>Something went wrong.</h2>
          <p>This incident has been reported to the Healix automated incident responder.</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "0.5rem 1rem", marginTop: "1rem", cursor: "pointer" }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}