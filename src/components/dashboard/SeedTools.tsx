"use client";

import { useState } from "react";
import { collection, doc, getDoc, getDocs, setDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  defaultCapabilities,
  defaultProfile,
  defaultProjects,
  defaultReviews,
  defaultSiteContent,
} from "@/lib/seedData";
import { notifyRevalidate } from "@/lib/notifyRevalidate";

// One-click way to reset Firestore to the original portfolio content.
// Deletes existing data and re-seeds with defaults.
export default function SeedTools() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSeed() {
    setBusy(true);
    setMsg(null);
    try {
      await setDoc(doc(db, "settings", "profile"), defaultProfile);
      await setDoc(doc(db, "settings", "site"), defaultSiteContent);

      await seedCollection("projects", defaultProjects);
      await seedCollection("reviews", defaultReviews);
      await seedCollection("capabilities", defaultCapabilities);

      await notifyRevalidate();
      setMsg({ type: "ok", text: "Default content reset to Firestore." });
    } catch (e) {
      setMsg({
        type: "err",
        text: e instanceof Error ? e.message : "Seeding failed. Check your Firebase setup and security rules.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function seedCollection<T extends object>(name: string, defaults: T[]) {
    const snap = await getDocs(collection(db, name));
    const batch = writeBatch(db);
    snap.forEach((doc) => batch.delete(doc.ref));
    defaults.forEach((item) => {
      const ref = doc(collection(db, name));
      batch.set(ref, item);
    });
    await batch.commit();
  }

  return (
    <div>
      <h2>Setup</h2>
      <p className="dash-sub">
        Resets Firestore to the original portfolio content. Deletes existing data and
        re-seeds with defaults.
      </p>
      {msg && <div className={`dash-msg ${msg.type === "ok" ? "ok" : "err"}`}>{msg.text}</div>}
      <div className="dash-card">
        <button className="dash-btn primary" onClick={handleSeed} disabled={busy}>
          {busy ? "Seeding…" : "Seed default content"}
        </button>
      </div>
    </div>
  );
}
