"use client";

import { useCallback, useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { notifyRevalidate } from "./notifyRevalidate";

// Generic singleton-document hook shared by the Profile and Site Content
// dashboard editors.
export function useFirestoreDoc<T>(collectionName: string, docId: string, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDoc(doc(db, collectionName, docId));
      setData(snap.exists() ? (snap.data() as T) : fallback);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, docId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    refresh();
  }, [refresh]);

  async function save(next: T) {
    await setDoc(doc(db, collectionName, docId), next as object, { merge: false });
    setData(next);
    await notifyRevalidate();
  }

  return { data, setData, loading, error, refresh, save };
}
