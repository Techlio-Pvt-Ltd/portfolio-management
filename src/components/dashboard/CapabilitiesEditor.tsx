"use client";

import { useState } from "react";
import { useFirestoreCollection } from "@/lib/useFirestoreCollection";
import { Capability } from "@/lib/types";

const emptyCapability: Omit<Capability, "id"> = {
  number: "01",
  heading: "",
  description: "",
  list: "",
  sortOrder: 0,
};

export default function CapabilitiesEditor() {
  const { items, loading, error, create, update, remove } = useFirestoreCollection<Capability>("capabilities");
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<Omit<Capability, "id">>(emptyCapability);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  function startNew() {
    setForm({ ...emptyCapability, number: String(items.length + 1).padStart(2, "0"), sortOrder: items.length });
    setEditingId("new");
    setMsg(null);
  }

  function startEdit(c: Capability) {
    const { id, ...rest } = c;
    void id;
    setForm(rest);
    setEditingId(c.id);
    setMsg(null);
  }

  function cancel() {
    setEditingId(null);
    setMsg(null);
  }

  async function handleSave() {
    if (!form.heading.trim()) {
      setMsg({ type: "err", text: "Heading is required." });
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

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this capability? This cannot be undone.")) return;
    try {
      await remove(id);
    } catch {
      setMsg({ type: "err", text: "Failed to delete." });
    }
  }

  return (
    <div>
      <h2>Capabilities</h2>
      <p className="dash-sub">The three cards in the Capabilities section. {items.length} total.</p>
      {error && <div className="dash-msg err">{error}</div>}
      {msg && <div className={`dash-msg ${msg.type === "ok" ? "ok" : "err"}`}>{msg.text}</div>}

      {editingId === null && (
        <button className="dash-btn primary" onClick={startNew} style={{ marginBottom: 18 }}>
          + Add capability
        </button>
      )}

      {editingId !== null && (
        <div className="dash-card">
          <div className="dash-form">
            <div className="dash-row">
              <div className="dash-field">
                <label>Number label</label>
                <input type="text" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
              </div>
              <div className="dash-field">
                <label>Heading</label>
                <input type="text" value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
              </div>
            </div>
            <div className="dash-field">
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="dash-field">
              <label>Tag list (comma-separated)</label>
              <input type="text" value={form.list} onChange={(e) => setForm({ ...form, list: e.target.value })} />
            </div>
            <div className="dash-field">
              <label>Sort order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="dash-btn primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save capability"}
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
          {items.length === 0 && <p className="dash-sub">No capabilities yet.</p>}
          {items.map((c) => (
            <div className="dash-list-item" key={c.id}>
              <div>
                <div className="title">{c.number} — {c.heading}</div>
              </div>
              <div className="dash-actions">
                <button className="dash-btn small" onClick={() => startEdit(c)}>Edit</button>
                <button className="dash-btn danger small" onClick={() => handleDelete(c.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
