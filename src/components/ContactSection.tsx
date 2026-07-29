import { Profile } from "@/lib/types";

export default function ContactSection({ profile }: { profile: Profile }) {
  return (
    <section id="contact">
      <div className="wrap">
        <div className="contact reveal">
          <div>
            <h2>{profile.contactHeading}</h2>
            <p>{profile.contactText}</p>
          </div>
          <div className="contact-links">
            {profile.contactLinks.map((l, i) => (
              <a
                key={i}
                href={l.href}
                target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={l.href.startsWith("mailto:") ? undefined : "noopener"}
              >
                <span>{l.label}</span>
                <span>{l.value}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
