const HEALIX_WEBHOOK_URL =
  import.meta.env.HEALIX_WEBHOOK_URL ||
  "https://healix.mohits.site/api/incidents/webhook?apiKey=5377ed08-3aa2-4358-bafc-59d2cd4bc147";

export function reportFrontendErrorToHealix({
  serviceName = "blood-donation-frontend",
  error,
  errorInfo = null,
}) {
  if (!HEALIX_WEBHOOK_URL) return;

  // Combine JS stack trace with React component hierarchy trace
  const fullStackTrace = [
    error?.stack || String(error),
    errorInfo?.componentStack ? `\nComponent Stack Trace:\n${errorInfo.componentStack}` : "",
  ].join("");

  const payload = {
    serviceName,
    message: error?.message || String(error) || "Unknown React Rendering Error",
    stackTrace: fullStackTrace,
    statusCode: 500,
    endpoint: typeof window !== "undefined" ? window.location.pathname : "/frontend",
  };

  try {
    fetch(HEALIX_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.error("[Healix Frontend Logger] Dispatch failed:", err);
    });
  } catch (err) {
    console.error("[Healix Frontend Logger] Error during send:", err);
  }
}