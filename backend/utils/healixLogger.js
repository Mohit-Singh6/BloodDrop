export async function sendErrorToHealix({ serviceName = "backend-api", err, req, statusCode = 500 }) {
  const webhookUrl = process.env.HEALIX_WEBHOOK_URL;
  if (!webhookUrl) return;

  const payload = {
    serviceName,
    message: err?.message || String(err),
    stackTrace: err?.stack || "No stack trace available",
    statusCode: statusCode || 500,
    endpoint: req ? `${req.method} ${req.originalUrl || req.url}` : "Internal Background Task",
  };

  try {
    // Non-blocking fetch so client requests don't hang
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((networkErr) => {
      console.error("[HealixLogger] Webhook delivery failed:", networkErr.message);
    });
  } catch (dispatchErr) {
    console.error("[HealixLogger] Dispatch error:", dispatchErr.message);
  }
}