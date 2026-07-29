// Tells the public site to refresh its cached content right after a
// dashboard save/delete, so changes appear live without a redeploy.
export async function notifyRevalidate() {
  try {
    await fetch("/api/revalidate", { method: "POST" });
  } catch {
    // Non-fatal: the page will still refresh on the next ISR cycle.
  }
}
