import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Called by the dashboard right after a save/delete so the public homepage
// reflects the change immediately instead of waiting for the next ISR cycle.
export async function POST() {
  revalidatePath("/");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
