"use client";

import { useState } from "react";
import { useFirestoreDoc } from "@/lib/useFirestoreDoc";
import { SiteContent } from "@/lib/types";
import { defaultSiteContent } from "@/lib/seedData";

export default function SiteContentEditor() {
  const { data, loading, save } = useFirestoreDoc<SiteContent>("settings", "site", defaultSiteContent);
  const [form, setForm] = useState<SiteContent | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const model = form ?? data;
  function set<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setForm({ ...model, [key]: value });
  }

  async function handleSave() {
    setSaving(true);
    setMsg(null);
    try {
      await save(model);
      setMsg({ type: "ok", text: "Site content saved." });
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

  if (loading) return <p className="dash-sub">Loading…</p>;

  return (
    <div>
      <h2>Site Content</h2>
      <p className="dash-sub">Nav links, section headings/kickers, and footer text.</p>
      {msg && <div className={`dash-msg ${msg.type === "ok" ? "ok" : "err"}`}>{msg.text}</div>}

      <div className="dash-card">
        <div className="dash-row">
          <div className="dash-field">
            <label>Nav CTA label</label>
            <input type="text" value={model.navCtaLabel} onChange={(e) => set("navCtaLabel", e.target.value)} />
          </div>
          <div className="dash-field">
            <label>Nav CTA link</label>
            <input type="text" value={model.navCtaHref} onChange={(e) => set("navCtaHref", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-row">
          <div className="dash-field">
            <label>Work — kicker</label>
            <input type="text" value={model.workKicker} onChange={(e) => set("workKicker", e.target.value)} />
          </div>
          <div className="dash-field">
            <label>Work — heading</label>
            <input type="text" value={model.workHeading} onChange={(e) => set("workHeading", e.target.value)} />
          </div>
        </div>
        <div className="dash-field" style={{ marginTop: 14 }}>
          <label>Work — subtext</label>
          <textarea value={model.workSubtext} onChange={(e) => set("workSubtext", e.target.value)} />
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-row">
          <div className="dash-field">
            <label>Reviews — kicker</label>
            <input type="text" value={model.reviewsKicker} onChange={(e) => set("reviewsKicker", e.target.value)} />
          </div>
          <div className="dash-field">
            <label>Reviews — heading</label>
            <input type="text" value={model.reviewsHeading} onChange={(e) => set("reviewsHeading", e.target.value)} />
          </div>
        </div>
        <div className="dash-field" style={{ marginTop: 14 }}>
          <label>Reviews — subtext</label>
          <textarea value={model.reviewsSubtext} onChange={(e) => set("reviewsSubtext", e.target.value)} />
        </div>
        <div className="dash-field" style={{ marginTop: 14 }}>
          <label>Trust banner text</label>
          <textarea value={model.trustBannerText} onChange={(e) => set("trustBannerText", e.target.value)} />
        </div>
        <div className="dash-row" style={{ marginTop: 14 }}>
          <div className="dash-field">
            <label>Trust banner number</label>
            <input type="text" value={model.trustBannerNumber} onChange={(e) => set("trustBannerNumber", e.target.value)} />
          </div>
          <div className="dash-field">
            <label>Trust banner number label</label>
            <input type="text" value={model.trustBannerNumberLabel} onChange={(e) => set("trustBannerNumberLabel", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-row">
          <div className="dash-field">
            <label>Capabilities — kicker</label>
            <input type="text" value={model.capabilitiesKicker} onChange={(e) => set("capabilitiesKicker", e.target.value)} />
          </div>
          <div className="dash-field">
            <label>Capabilities — heading</label>
            <input type="text" value={model.capabilitiesHeading} onChange={(e) => set("capabilitiesHeading", e.target.value)} />
          </div>
        </div>
        <div className="dash-row" style={{ marginTop: 14 }}>
          <div className="dash-field">
            <label>About — kicker</label>
            <input type="text" value={model.aboutKicker} onChange={(e) => set("aboutKicker", e.target.value)} />
          </div>
          <div className="dash-field">
            <label>About — heading</label>
            <input type="text" value={model.aboutHeading} onChange={(e) => set("aboutHeading", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-row">
          <div className="dash-field">
            <label>Footer — left text</label>
            <input type="text" value={model.footerLeft} onChange={(e) => set("footerLeft", e.target.value)} />
          </div>
          <div className="dash-field">
            <label>Footer — right text</label>
            <input type="text" value={model.footerRight} onChange={(e) => set("footerRight", e.target.value)} />
          </div>
        </div>
      </div>

      <button className="dash-btn primary" onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save site content"}
      </button>
    </div>
  );
}
