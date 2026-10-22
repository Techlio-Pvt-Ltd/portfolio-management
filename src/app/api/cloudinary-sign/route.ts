import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { verifyFirebaseRequest } from "@/lib/serverAuth";

export const runtime = "nodejs";

const FOLDER = "portfolio";

// Signs Cloudinary upload params for the signed-in dashboard so image uploads
// use a server-held API secret instead of a public unsigned preset — strangers
// who extract the old preset name from the bundle can't upload anything.
export async function POST(request: Request) {
  if (!(await verifyFirebaseRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!apiKey || !apiSecret || !cloudName) {
    return NextResponse.json({ error: "Cloudinary is not configured." }, { status: 500 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = createHash("sha1")
    .update(`folder=${FOLDER}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  return NextResponse.json({ timestamp, signature, folder: FOLDER, apiKey, cloudName });
}
