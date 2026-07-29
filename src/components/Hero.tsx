import Image from "next/image";
import { Profile } from "@/lib/types";

export default function Hero({ profile }: { profile: Profile }) {
  const badges = profile.badges.split(",").map((b) => b.trim()).filter(Boolean);

  return (
    <div className="wrap hero">
      <div className="hero-grid">
        <div>
          <div className="badges reveal">
            {badges.map((b, i) => (
              <span key={i} className={`badge ${i === 0 ? "gold" : ""}`}>
                {b}
              </span>
            ))}
          </div>
          <h1 className="reveal">
            {profile.heroHeadingBefore} <b>{profile.heroHeadingHighlight}</b>{" "}
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
        <div className="portrait reveal">
          <Image
            src={profile.portraitUrl}
            alt={profile.name}
            width={340}
            height={340}
            priority
          />
          <span className="tag">{profile.portraitTag}</span>
        </div>
      </div>

      <div className="stats reveal" aria-label="Career stats">
        {profile.stats.map((s, i) => (
          <div className="stat" key={i}>
            <div className="n">{s.value}</div>
            <div className="l">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
