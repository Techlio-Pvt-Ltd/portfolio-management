import { Profile, SiteContent } from "@/lib/types";

export default function AboutSection({
  site,
  profile,
}: {
  site: SiteContent;
  profile: Profile;
}) {
  const paragraphs = profile.aboutParagraphs.split("\n\n").filter(Boolean);

  return (
    <section id="about">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="kicker">{site.aboutKicker}</span>
          <h2>{site.aboutHeading}</h2>
        </div>
        <div className="about-grid reveal">
          <div>
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="cred" aria-label="Credentials">
            {profile.credentials.map((c, i) => (
              <div className="cred-row" key={i}>
                <span className="ck">{c.label}</span>
                <span className={`cv ${c.gold ? "gold" : ""}`}>{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
