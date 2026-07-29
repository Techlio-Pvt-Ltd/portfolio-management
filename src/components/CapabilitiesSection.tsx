import { Capability, SiteContent } from "@/lib/types";

export default function CapabilitiesSection({
  site,
  capabilities,
}: {
  site: SiteContent;
  capabilities: Capability[];
}) {
  return (
    <section id="capabilities">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="kicker">{site.capabilitiesKicker}</span>
          <h2>{site.capabilitiesHeading}</h2>
        </div>
        <div className="caps reveal">
          {capabilities.map((c) => (
            <div className="cap" key={c.id}>
              <span className="num">{c.number}</span>
              <h4>{c.heading}</h4>
              <p>{c.description}</p>
              <div className="list">
                {c.list
                  .split(",")
                  .map((l) => l.trim())
                  .join(" · ")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
