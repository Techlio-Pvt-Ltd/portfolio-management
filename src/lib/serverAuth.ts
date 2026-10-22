// Server-only helper used by admin API routes (revalidate, cloudinary-sign).
// Verifies the Firebase ID token the signed-in dashboard sends as a Bearer
// token, so anonymous callers get rejected instead of triggering paid work.
//
// Uses the Identity Toolkit accounts:lookup REST endpoint — the same API
// email/password sign-in already uses — so no firebase-admin dependency or
// service-account credentials are needed.
export async function verifyFirebaseRequest(request: Request): Promise<boolean> {
  const header = request.headers.get("authorization");
  const idToken = header?.startsWith("Bearer ") ? header.slice(7) : null;
  // Anyone can self-register a Firebase user with the public API key, so a
  // valid token alone proves nothing — it must belong to the admin UID.
  // Fails closed if ADMIN_UID isn't configured.
  const adminUid = process.env.ADMIN_UID;
  if (!idToken || !adminUid) return false;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!res.ok) return false;
    const data = await res.json();
    return data.users?.[0]?.localId === adminUid;
  } catch {
    return false;
  }
}
