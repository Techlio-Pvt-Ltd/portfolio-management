import { Profile } from "@/lib/types";

export default function Hero({ profile }: { profile: Profile }) {
  const badges = profile.badges.split(",").map((b) => b.trim()).filter(Boolean);
  const statusLine =
    profile.availabilityBannerStatus ||
    profile.portraitTag ||
    profile.location;
  const avatar =
    profile.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || profile.brandInitials.slice(0, 2);

  return (
    <div className="wrap hero">
      <div className="hero-grid">
        <div>
          <div className="sys-line reveal">{statusLine}</div>
          <h1 className="reveal">
            {profile.heroHeadingBefore}{" "}
            <span className="grad">{profile.heroHeadingHighlight}</span>{" "}
            {profile.heroHeadingAfter}
          </h1>
          <p className="lede reveal">{profile.heroLede}</p>
          <div className="hero-cta reveal">
            <a className="btn primary" href={profile.ctaPrimaryHref}>
              {profile.ctaPrimaryLabel}
            </a>
            <a className="btn ghost" href={profile.ctaSecondaryHref}>
              {profile.ctaSecondaryLabel}
            </a>
          </div>
        </div>

        <div className="pcard reveal">
          <div className="avatar">{avatar}</div>
          <div className="pname">{profile.name}</div>
          <div className="prole">{profile.title}</div>
          <div className="pbadges">
            {badges.map((b, i) => (
              <span key={i} className="pbadge">
                {b}
              </span>
            ))}
          </div>
          <div className="pstats" aria-label="Career stats">
            {profile.stats.map((s, i) => (
              <div className="ps" key={i}>
                <div className="n">{s.value}</div>
                <div className="l">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
