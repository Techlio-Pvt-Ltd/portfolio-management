"use client";

import { useState } from "react";
import { useFirestoreDoc } from "@/lib/useFirestoreDoc";
import { ContactLink, CredentialRow, Profile, StatItem } from "@/lib/types";
import { defaultProfile } from "@/lib/seedData";

export default function ProfileEditor() {
  const { data, loading, save } = useFirestoreDoc<Profile>("settings", "profile", defaultProfile);
  const [form, setForm] = useState<Profile | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const model = form ?? data;

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm({ ...model, [key]: value });
  }

  async function handleSave() {
    setSaving(true);
    setMsg(null);
    try {
      await save(model);
      setMsg({ type: "ok", text: "Profile saved." });
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

  function updateStat(i: number, field: keyof StatItem, value: string) {
    const stats = [...model.stats];
    stats[i] = { ...stats[i], [field]: value };
    set("stats", stats);
  }
  function addStat() {
    set("stats", [...model.stats, { value: "", label: "" }]);
  }
  function removeStat(i: number) {
    set("stats", model.stats.filter((_, idx) => idx !== i));
  }

  function updateCred(i: number, field: keyof CredentialRow, value: string | boolean) {
    const rows = [...model.credentials];
    rows[i] = { ...rows[i], [field]: value };
    set("credentials", rows);
  }
  function addCred() {
    set("credentials", [...model.credentials, { label: "", value: "" }]);
  }
  function removeCred(i: number) {
    set("credentials", model.credentials.filter((_, idx) => idx !== i));
  }

  function updateLink(i: number, field: keyof ContactLink, value: string) {
    const links = [...model.contactLinks];
    links[i] = { ...links[i], [field]: value };
    set("contactLinks", links);
  }
  function addLink() {
    set("contactLinks", [...model.contactLinks, { label: "", value: "", href: "" }]);
  }
  function removeLink(i: number) {
    set("contactLinks", model.contactLinks.filter((_, idx) => idx !== i));
  }

  if (loading) return <p className="dash-sub">Loading…</p>;

  return (
    <div>
      <h2>Profile</h2>
      <p className="dash-sub">Hero, stats, about, credentials, and contact info shown on the site.</p>
      {msg && <div className={`dash-msg ${msg.type === "ok" ? "ok" : "err"}`}>{msg.text}</div>}

      <div className="dash-card">
        <div className="dash-form">
          <div className="dash-row">
            <div className="dash-field">
              <label>Brand initials</label>
              <input type="text" value={model.brandInitials} onChange={(e) => set("brandInitials", e.target.value)} />
            </div>
            <div className="dash-field">
              <label>Name</label>
              <input type="text" value={model.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="dash-field">
              <label>Title</label>
              <input type="text" value={model.title} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div className="dash-field">
              <label>Location</label>
              <input type="text" value={model.location} onChange={(e) => set("location", e.target.value)} />
            </div>
          </div>

          <div className="dash-field">
            <label>Badges (comma-separated)</label>
            <input type="text" value={model.badges} onChange={(e) => set("badges", e.target.value)} />
          </div>

          <div className="dash-row">
            <div className="dash-field">
              <label>Hero heading — before highlight</label>
              <input type="text" value={model.heroHeadingBefore} onChange={(e) => set("heroHeadingBefore", e.target.value)} />
            </div>
            <div className="dash-field">
              <label>Hero heading — highlighted</label>
              <input type="text" value={model.heroHeadingHighlight} onChange={(e) => set("heroHeadingHighlight", e.target.value)} />
            </div>
            <div className="dash-field">
              <label>Hero heading — after highlight</label>
              <input type="text" value={model.heroHeadingAfter} onChange={(e) => set("heroHeadingAfter", e.target.value)} />
            </div>
          </div>

          <div className="dash-field">
            <label>Hero paragraph</label>
            <textarea value={model.heroLede} onChange={(e) => set("heroLede", e.target.value)} />
          </div>

          <div className="dash-row">
            <div className="dash-field">
              <label>Primary button label</label>
              <input type="text" value={model.ctaPrimaryLabel} onChange={(e) => set("ctaPrimaryLabel", e.target.value)} />
            </div>
            <div className="dash-field">
              <label>Primary button link</label>
              <input type="text" value={model.ctaPrimaryHref} onChange={(e) => set("ctaPrimaryHref", e.target.value)} />
            </div>
            <div className="dash-field">
              <label>Secondary button label</label>
              <input type="text" value={model.ctaSecondaryLabel} onChange={(e) => set("ctaSecondaryLabel", e.target.value)} />
            </div>
            <div className="dash-field">
              <label>Secondary button link</label>
              <input type="text" value={model.ctaSecondaryHref} onChange={(e) => set("ctaSecondaryHref", e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="dash-card">
        <label style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12.5, color: "var(--muted)", textTransform: "uppercase" }}>
          Availability Banner
        </label>
        <div className="dash-field" style={{ marginTop: 10 }}>
          <label>Icon (emoji)</label>
          <input type="text" value={model.availabilityBannerIcon} onChange={(e) => set("availabilityBannerIcon", e.target.value)} placeholder="🚀" />
        </div>
        <div className="dash-field">
          <label>Status text</label>
          <input type="text" value={model.availabilityBannerStatus} onChange={(e) => set("availabilityBannerStatus", e.target.value)} placeholder="OPEN TO WORK" />
        </div>
        <div className="dash-field">
          <label>Heading</label>
          <input type="text" value={model.availabilityBannerHeading} onChange={(e) => set("availabilityBannerHeading", e.target.value)} placeholder="Available for New Projects" />
        </div>
        <div className="dash-field">
          <label>Subtext</label>
          <input type="text" value={model.availabilityBannerSubtext} onChange={(e) => set("availabilityBannerSubtext", e.target.value)} placeholder="Let's build something great together" />
        </div>
      </div>

      <div className="dash-card">
        <label style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12.5, color: "var(--muted)", textTransform: "uppercase" }}>
          Stats
        </label>
        {model.stats.map((s, i) => (
          <div className="dash-row" key={i} style={{ marginTop: 10 }}>
            <div className="dash-field">
              <input type="text" placeholder="Value, e.g. $500K+" value={s.value} onChange={(e) => updateStat(i, "value", e.target.value)} />
            </div>
            <div className="dash-field">
              <input type="text" placeholder="Label" value={s.label} onChange={(e) => updateStat(i, "label", e.target.value)} />
            </div>
            <button className="dash-btn danger small" onClick={() => removeStat(i)}>Remove</button>
          </div>
        ))}
        <button className="dash-btn small" style={{ marginTop: 10 }} onClick={addStat}>+ Add stat</button>
      </div>

      <div className="dash-card">
        <label style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12.5, color: "var(--muted)", textTransform: "uppercase" }}>
          About paragraphs (blank line between each)
        </label>
        <textarea
          style={{ minHeight: 160, width: "100%", marginTop: 10, background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: 8, color: "var(--text)", padding: 12, fontFamily: "inherit", fontSize: 14 }}
          value={model.aboutParagraphs}
          onChange={(e) => set("aboutParagraphs", e.target.value)}
        />
      </div>

      <div className="dash-card">
        <label style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12.5, color: "var(--muted)", textTransform: "uppercase" }}>
          Credentials
        </label>
        {model.credentials.map((c, i) => (
          <div className="dash-row" key={i} style={{ marginTop: 10, alignItems: "center" }}>
            <div className="dash-field">
              <input type="text" placeholder="Label" value={c.label} onChange={(e) => updateCred(i, "label", e.target.value)} />
            </div>
            <div className="dash-field">
              <input type="text" placeholder="Value" value={c.value} onChange={(e) => updateCred(i, "value", e.target.value)} />
            </div>
            <label className="dash-checkbox">
              <input type="checkbox" checked={!!c.gold} onChange={(e) => updateCred(i, "gold", e.target.checked)} />
              Gold
            </label>
            <button className="dash-btn danger small" onClick={() => removeCred(i)}>Remove</button>
          </div>
        ))}
        <button className="dash-btn small" style={{ marginTop: 10 }} onClick={addCred}>+ Add credential</button>
      </div>

      <div className="dash-card">
        <div className="dash-field" style={{ marginBottom: 14 }}>
          <label>Contact heading</label>
          <input type="text" value={model.contactHeading} onChange={(e) => set("contactHeading", e.target.value)} />
        </div>
        <div className="dash-field" style={{ marginBottom: 14 }}>
          <label>Contact text</label>
          <textarea value={model.contactText} onChange={(e) => set("contactText", e.target.value)} />
        </div>
        <label style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12.5, color: "var(--muted)", textTransform: "uppercase" }}>
          Contact links
        </label>
        {model.contactLinks.map((l, i) => (
          <div className="dash-row" key={i} style={{ marginTop: 10 }}>
            <div className="dash-field">
              <input type="text" placeholder="Label" value={l.label} onChange={(e) => updateLink(i, "label", e.target.value)} />
            </div>
            <div className="dash-field">
              <input type="text" placeholder="Display value" value={l.value} onChange={(e) => updateLink(i, "value", e.target.value)} />
            </div>
            <div className="dash-field">
              <input type="text" placeholder="URL / mailto:" value={l.href} onChange={(e) => updateLink(i, "href", e.target.value)} />
            </div>
            <button className="dash-btn danger small" onClick={() => removeLink(i)}>Remove</button>
          </div>
        ))}
        <button className="dash-btn small" style={{ marginTop: 10 }} onClick={addLink}>+ Add contact link</button>
      </div>

      <button className="dash-btn primary" onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save profile"}
      </button>
    </div>
  );
}
