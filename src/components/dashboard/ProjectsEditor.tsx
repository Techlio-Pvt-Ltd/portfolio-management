"use client";

import { useState } from "react";
import { useFirestoreCollection } from "@/lib/useFirestoreCollection";
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
    </div>
  );
}
