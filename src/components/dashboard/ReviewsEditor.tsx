"use client";

import { useState } from "react";
import { useFirestoreCollection } from "@/lib/useFirestoreCollection";
import { Review } from "@/lib/types";

const emptyReview: Omit<Review, "id"> = {
  stars: 5,
  quote: "",
  jobTitle: "",
  facts: "",
  endorsements: "",
  sortOrder: 0,
};

export default function ReviewsEditor() {
  const { items, loading, error, create, update, remove } = useFirestoreCollection<Review>("reviews");
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<Omit<Review, "id">>(emptyReview);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  function startNew() {
    setForm({ ...emptyReview, sortOrder: items.length });
    setEditingId("new");
    setMsg(null);
  }

  function startEdit(r: Review) {
    const { id, ...rest } = r;
    void id;
    setForm(rest);
    setEditingId(r.id);
    setMsg(null);
  }

  function cancel() {
    setEditingId(null);
    setMsg(null);
  }

  async function handleSave() {
    if (!form.quote.trim()) {
      setMsg({ type: "err", text: "Quote is required." });
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
    if (!window.confirm("Delete this review? This cannot be undone.")) return;
    try {
      await remove(id);
    } catch {
      setMsg({ type: "err", text: "Failed to delete." });
    }
  }

  return (
    <div>
      <h2>Reviews</h2>
      <p className="dash-sub">Client testimonials shown in the Reviews section. {items.length} total.</p>
      {error && <div className="dash-msg err">{error}</div>}
      {msg && <div className={`dash-msg ${msg.type === "ok" ? "ok" : "err"}`}>{msg.text}</div>}

      {editingId === null && (
        <button className="dash-btn primary" onClick={startNew} style={{ marginBottom: 18 }}>
          + Add review
        </button>
      )}

      {editingId !== null && (
        <div className="dash-card">
          <div className="dash-form">
            <div className="dash-row">
              <div className="dash-field">
                <label>Stars (1–5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.stars}
                  onChange={(e) => setForm({ ...form, stars: Number(e.target.value) })}
                />
              </div>
              <div className="dash-field">
                <label>Facts (rate · hours · year)</label>
                <input type="text" value={form.facts} onChange={(e) => setForm({ ...form, facts: e.target.value })} />
              </div>
            </div>
            <div className="dash-field">
              <label>Quote</label>
              <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
            </div>
            <div className="dash-field">
              <label>Job title</label>
              <input type="text" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} />
            </div>
            <div className="dash-field">
              <label>Endorsement tags (comma-separated)</label>
              <input type="text" value={form.endorsements} onChange={(e) => setForm({ ...form, endorsements: e.target.value })} />
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
                {saving ? "Saving…" : "Save review"}
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
          {items.length === 0 && <p className="dash-sub">No reviews yet.</p>}
          {items.map((r) => (
            <div className="dash-list-item" key={r.id}>
              <div>
                <div className="title">{r.jobTitle || "Untitled review"}</div>
                <div className="sub">{"★".repeat(r.stars)} · {r.facts}</div>
              </div>
              <div className="dash-actions">
                <button className="dash-btn small" onClick={() => startEdit(r)}>Edit</button>
                <button className="dash-btn danger small" onClick={() => handleDelete(r.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
