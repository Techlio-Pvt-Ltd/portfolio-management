import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { verifyFirebaseRequest } from "@/lib/serverAuth";

// Called by the dashboard right after a save/delete so the public homepage
// reflects the change immediately instead of waiting for the next ISR cycle.
// Requires the signed-in admin's Firebase ID token — otherwise anyone could
// force homepage regenerations and burn the Firestore read quota.
export async function POST(request: Request) {
  if (!(await verifyFirebaseRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidatePath("/");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
