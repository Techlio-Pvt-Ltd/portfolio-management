"use client";

import { useState } from "react";
import { logout } from "./AuthGate";
import ProfileEditor from "./ProfileEditor";
import SiteContentEditor from "./SiteContentEditor";
import ProjectsEditor from "./ProjectsEditor";
import ReviewsEditor from "./ReviewsEditor";
import CapabilitiesEditor from "./CapabilitiesEditor";
import SeedTools from "./SeedTools";

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "site", label: "Site Content" },
  { key: "projects", label: "Projects" },
  { key: "reviews", label: "Reviews" },
  { key: "capabilities", label: "Capabilities" },
  { key: "setup", label: "Setup" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function DashboardShell() {
  const [tab, setTab] = useState<TabKey>("profile");

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="brand">
          Portfolio<span style={{ color: "var(--amber)" }}>.</span>Admin
        </div>
        <nav className="dash-nav">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={tab === t.key ? "active" : ""}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="dash-logout">
          <button className="dash-btn small" onClick={() => logout()}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="dash-main">
        {tab === "profile" && <ProfileEditor />}
        {tab === "site" && <SiteContentEditor />}
        {tab === "projects" && <ProjectsEditor />}
        {tab === "reviews" && <ReviewsEditor />}
        {tab === "capabilities" && <CapabilitiesEditor />}
        {tab === "setup" && <SeedTools />}
      </main>
    </div>
  );
}
