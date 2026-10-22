import { cache } from "react";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import { Capability, Profile, Project, Review, SiteContent } from "./types";
import {
  defaultCapabilities,
  defaultProfile,
  defaultProjects,
  defaultReviews,
  defaultSiteContent,
} from "./seedData";

// Server-side reads used by the public site. Falls back to bundled defaults
// if Firestore isn't configured yet or a document doesn't exist, so the site
// always renders something sensible.

export const getProfile = cache(async (): Promise<Profile> => {
  try {
    const snap = await getDoc(doc(db, "settings", "profile"));
    if (snap.exists()) return snap.data() as Profile;
  } catch {
    // Firestore not reachable/configured — use defaults.
  }
  return defaultProfile;
});

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const snap = await getDoc(doc(db, "settings", "site"));
    if (snap.exists()) return snap.data() as SiteContent;
  } catch {
    // ignore
  }
  return defaultSiteContent;
}

export async function getProjects(): Promise<Project[]> {
  try {
    const q = query(collection(db, "projects"), orderBy("sortOrder", "asc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) }))
        .filter((p) => p.published);
    }
  } catch {
    // ignore
  }
  return defaultProjects.map((p, i) => ({ ...p, id: `default-${i}` }));
}

export async function getReviews(): Promise<Review[]> {
  try {
    const q = query(collection(db, "reviews"), orderBy("sortOrder", "asc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Review, "id">) }));
    }
  } catch {
    // ignore
  }
  return defaultReviews.map((r, i) => ({ ...r, id: `default-${i}` }));
}

export async function getCapabilities(): Promise<Capability[]> {
  try {
    const q = query(collection(db, "capabilities"), orderBy("sortOrder", "asc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Capability, "id">) }));
    }
  } catch {
    // ignore
  }
  return defaultCapabilities.map((c, i) => ({ ...c, id: `default-${i}` }));
}
