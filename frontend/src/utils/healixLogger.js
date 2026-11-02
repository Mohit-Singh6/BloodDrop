const HEALIX_WEBHOOK_URL =
  process.env.HEALIX_WEBHOOK_URL ||
  "https://healix.mohits.site/api/incidents/webhook?apiKey=021dd493-eac1-4b56-80f3-a74a633dfbbc";

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
      mode: "no-cors", // prevents cors issues
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.error("[Healix Frontend Logger] Dispatch failed:", err);
    });
  } catch (err) {
    console.error("[Healix Frontend Logger] Error during send:", err);
  }
}