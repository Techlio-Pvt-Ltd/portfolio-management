"use client";

import { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useFirestoreCollection } from "@/lib/useFirestoreCollection";
import { auth } from "@/lib/firebase";
import { Project } from "@/lib/types";

const emptyProject: Omit<Project, "id"> = {
  title: "",
  coverWord: "",
  kicker: "",
  markText: "",
  color1: "#1E3A5A",
  color2: "#2E5A8A",
  metric: "",
  description: "",
  stack: "",
  liveLabel: "",
  liveUrl: "",
  categories: "saas",
  sortOrder: 0,
  published: true,
};

export default function ProjectsEditor() {
  const { items, loading, error, create, update, remove } = useFirestoreCollection<Project>("projects");
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(emptyProject);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function startNew() {
    setForm({ ...emptyProject, sortOrder: items.length });
    setEditingId("new");
    setMsg(null);
  }

  function startEdit(p: Project) {
    const { id, ...rest } = p;
    void id;
    setForm(rest);
    setEditingId(p.id);
    setMsg(null);
  }

  function cancel() {
    setEditingId(null);
    setMsg(null);
  }

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result as string);
        setCropModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
    const initialCrop = {
      unit: "%" as const,
      x: 25,
      y: 25,
      width: 50,
      height: 50,
    };
    setCrop(initialCrop);
  }

  async function handleCropAndUpload() {
    if (!completedCrop || !imgRef.current || !canvasRef.current) return;

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      setUploading(true);
      setMsg(null);
      try {
        const idToken = await auth?.currentUser?.getIdToken();
        if (!idToken) throw new Error("Not signed in.");

        const signRes = await fetch("/api/cloudinary-sign", {
          method: "POST",
          headers: { Authorization: `Bearer ${idToken}` },
        });
        const sign = await signRes.json();
        if (!signRes.ok) throw new Error(sign.error || "Failed to sign upload.");

        const formData = new FormData();
        formData.append("file", blob);
        formData.append("api_key", sign.apiKey);
        formData.append("timestamp", String(sign.timestamp));
        formData.append("signature", sign.signature);
        formData.append("folder", sign.folder);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
          { method: "POST", body: formData }
        );

        const data = await res.json();
        if (!res.ok || !data.secure_url) {
          throw new Error(data.error?.message || "Upload failed");
        }

        setForm({ ...form, imageUrl: data.secure_url });
        setCropModalOpen(false);
        setImageSrc("");
        setSelectedFile(null);
      } catch (e) {
        console.error(e);
        setMsg({
          type: "err",
          text: e instanceof Error ? `Upload failed: ${e.message}` : "Upload failed. Check Cloudinary setup.",
        });
      } finally {
        setUploading(false);
      }
    }, "image/jpeg", 0.9);
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setMsg({ type: "err", text: "Title is required." });
      return;
    }
    setSaving(true);
    setMsg(null);
    try {
      if (editingId === "new") {
        await create(form);
      } else if (editingId) {
        await update(editingId, form);
      }
      setEditingId(null);
    } catch (e) {
      console.error(e);
      setMsg({
        type: "err",
        text: e instanceof Error ? `Failed to save: ${e.message}` : "Failed to save. Check your Firebase setup.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete project "${title}"? This cannot be undone.`)) return;
    try {
      await remove(id);
    } catch {
      setMsg({ type: "err", text: "Failed to delete." });
    }
  }

  return (
    <div>
      <h2>Projects</h2>
      <p className="dash-sub">Case studies shown in the Work section. {items.length} total.</p>
      {error && <div className="dash-msg err">{error}</div>}
      {msg && <div className={`dash-msg ${msg.type === "ok" ? "ok" : "err"}`}>{msg.text}</div>}

      {editingId === null && (
        <button className="dash-btn primary" onClick={startNew} style={{ marginBottom: 18 }}>
          + Add project
        </button>
      )}

      {editingId !== null && (
        <div className="dash-card">
          <div className="dash-form">
            <div className="dash-row">
              <div className="dash-field">
                <label>Title (shown as card heading)</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="dash-field">
                <label>Cover word (brand/product name)</label>
                <input type="text" value={form.coverWord} onChange={(e) => setForm({ ...form, coverWord: e.target.value })} />
              </div>
            </div>
            <div className="dash-row">
              <div className="dash-field">
                <label>Kicker (small text on cover)</label>
                <input type="text" value={form.kicker} onChange={(e) => setForm({ ...form, kicker: e.target.value })} />
              </div>
              <div className="dash-field">
                <label>Mark initials (e.g. QM)</label>
                <input type="text" value={form.markText} onChange={(e) => setForm({ ...form, markText: e.target.value })} />
              </div>
              <div className="dash-field">
                <label>Metric badge</label>
                <input type="text" value={form.metric} onChange={(e) => setForm({ ...form, metric: e.target.value })} />
              </div>
            </div>
            <div className="dash-row">
              <div className="dash-field">
                <label>Cover color 1</label>
                <input type="text" value={form.color1} onChange={(e) => setForm({ ...form, color1: e.target.value })} />
              </div>
              <div className="dash-field">
                <label>Cover color 2</label>
                <input type="text" value={form.color2} onChange={(e) => setForm({ ...form, color2: e.target.value })} />
              </div>
            </div>
            <div className="dash-field">
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="dash-field">
              <label>Tech stack (comma-separated)</label>
              <input type="text" value={form.stack} onChange={(e) => setForm({ ...form, stack: e.target.value })} />
            </div>
            <div className="dash-row">
              <div className="dash-field">
                <label>Live link label</label>
                <input type="text" value={form.liveLabel} onChange={(e) => setForm({ ...form, liveLabel: e.target.value })} />
              </div>
              <div className="dash-field">
                <label>Live link URL</label>
                <input type="text" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
              </div>
            </div>
            <div className="dash-field">
              <label>Categories (comma-separated)</label>
              <input
                type="text"
                placeholder="ai, saas, realtime, apps"
                value={form.categories}
                onChange={(e) => setForm({ ...form, categories: e.target.value })}
              />
            </div>
            <div className="dash-field">
              <label>Project image</label>
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Project preview"
                  style={{ maxWidth: "100%", maxHeight: "200px", marginBottom: "10px", borderRadius: "8px" }}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                disabled={uploading}
              />
              {uploading && <span style={{ fontSize: "12px", color: "var(--muted)" }}>Uploading...</span>}
            </div>
            <div className="dash-row">
              <div className="dash-field">
                <label>Sort order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                />
              </div>
              <label className="dash-checkbox" style={{ alignSelf: "center", marginTop: 18 }}>
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                />
                Published (visible on site)
              </label>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="dash-btn primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save project"}
              </button>
              <button className="dash-btn" onClick={cancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="dash-sub">Loading…</p>
      ) : (
        <div className="dash-card">
          {items.length === 0 && <p className="dash-sub">No projects yet.</p>}
          {items.map((p) => (
            <div className="dash-list-item" key={p.id}>
              <div>
                <div className="title">{p.title}</div>
                <div className="sub">{p.categories} · {p.published ? "published" : "hidden"}</div>
              </div>
              <div className="dash-actions">
                <button className="dash-btn small" onClick={() => startEdit(p)}>Edit</button>
                <button className="dash-btn danger small" onClick={() => handleDelete(p.id, p.title)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cropModalOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            background: "var(--surface)", padding: "24px", borderRadius: "12px",
            maxWidth: "90vw", maxHeight: "90vh", overflow: "auto"
          }}>
            <h3 style={{ marginBottom: "16px" }}>Crop Image</h3>
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imageSrc}
                  style={{ maxWidth: "100%", maxHeight: "60vh" }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}
            <canvas
              ref={canvasRef}
              style={{ display: "none" }}
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "16px", justifyContent: "flex-end" }}>
              <button
                className="dash-btn"
                onClick={() => {
                  setCropModalOpen(false);
                  setImageSrc("");
                  setSelectedFile(null);
                }}
              >
                Cancel
              </button>
              <button
                className="dash-btn primary"
                onClick={handleCropAndUpload}
                disabled={uploading || !completedCrop}
              >
                {uploading ? "Uploading..." : "Crop & Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
