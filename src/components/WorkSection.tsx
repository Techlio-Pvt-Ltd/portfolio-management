"use client";

import { useMemo, useState } from "react";
import { Project, SiteContent } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  ai: "AI & Agents",
  saas: "SaaS Platforms",
  realtime: "Real-time",
  apps: "Mobile & Desktop",
};

export default function WorkSection({
  site,
  projects,
}: {
  site: SiteContent;
  projects: Project[];
}) {
  const [filter, setFilter] = useState("all");

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    projects.forEach((p) => {
      p.categories.split(",").map((c) => c.trim()).filter(Boolean).forEach((cat) => categories.add(cat));
    });
    return Array.from(categories).sort();
  }, [projects]);

  const filters = useMemo(() => [
    { key: "all", label: "All" },
    ...allCategories.map((cat) => ({ key: cat, label: CATEGORY_LABELS[cat] || cat })),
  ], [allCategories]);

  const visible = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((p) =>
      p.categories
        .split(",")
        .map((c) => c.trim())
        .includes(filter)
    );
  }, [filter, projects]);

  return (
    <section id="work">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="kicker">{site.workKicker}</span>
          <h2>{site.workHeading}</h2>
          <p>{site.workSubtext}</p>
        </div>

        <div className="filters reveal" role="group" aria-label="Filter projects">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`chip ${filter === f.key ? "active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.key === "all" ? `All ${projects.length}` : f.label}
            </button>
          ))}
        </div>

        <div className="grid" id="projectGrid">
          {visible.map((p) => (
            <article className="card reveal in" key={p.id}>
              {p.imageUrl ? (
                <div className="cover-image">
                  <img src={p.imageUrl} alt={p.title} />
                </div>
              ) : (
                <div
                  className="cover"
                  style={{ "--c1": p.color1, "--c2": p.color2 } as React.CSSProperties}
                  aria-hidden="true"
                >
                  <span className="mark">{p.markText}</span>
                  <span className="word">
                    <small>{p.kicker}</small>
                    {p.coverWord}
                  </span>
                </div>
              )}
              <div className="body">
                <div className="top">
                  <h3>{p.title}</h3>
                  <span className="metric">{p.metric}</span>
                </div>
                <p className="desc">{p.description}</p>
                <div className="stack">
                  {p.stack
                    .split(",")
                    .map((s) => s.trim())
                    .join(" · ")}
                </div>
                {p.liveUrl && (
                  <a className="live" href={p.liveUrl} target="_blank" rel="noopener">
                    {p.liveLabel || p.liveUrl}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
