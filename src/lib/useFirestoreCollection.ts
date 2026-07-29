"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { notifyRevalidate } from "./notifyRevalidate";

// Generic list-collection CRUD hook shared by the Projects, Reviews, and
// Capabilities dashboard editors. Keeps that logic in one place instead of
// duplicating fetch/add/update/delete three times.
export function useFirestoreCollection<T extends { id: string }>(name: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, name), orderBy("sortOrder", "asc"));
      const snap = await getDocs(q);
      setItems(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) } as T))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [name]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    refresh();
  }, [refresh]);

  async function create(data: Omit<T, "id">) {
    await addDoc(collection(db, name), data);
    await refresh();
    await notifyRevalidate();
  }

  async function update(id: string, data: Partial<T>) {
    await updateDoc(doc(db, name, id), data as DocumentData);
    await refresh();
    await notifyRevalidate();
  }

  async function remove(id: string) {
    await deleteDoc(doc(db, name, id));
    await refresh();
    await notifyRevalidate();
  }

  return { items, loading, error, refresh, create, update, remove };
}
