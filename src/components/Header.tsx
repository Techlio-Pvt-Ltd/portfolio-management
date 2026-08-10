import { Profile, SiteContent } from "@/lib/types";

export default function Header({
  profile,
  site,
}: {
  profile: Profile;
  site: SiteContent;
}) {
  const links = ["Work", "Reviews", "Capabilities", "About"];
  const [brandBase, ...brandRest] = profile.brandInitials.split(".");
  const brandAccent = brandRest.length ? `.${brandRest.join(".")}` : ".";

  return (
    <header>
      <div className="wrap nav">
        <a className="brand" href="#top">
          {brandBase}
          <span>{brandAccent}</span>
        </a>
        <nav className="nav-links" aria-label="Main">
          {links.map((label) => (
            <a key={label} href={`#${label.toLowerCase()}`}>
              {label}
            </a>
          ))}
          <a className="nav-cta" href={site.navCtaHref} target="_blank" rel="noopener">
            {site.navCtaLabel}
          </a>
        </nav>
      </div>
    </header>
  );
}
