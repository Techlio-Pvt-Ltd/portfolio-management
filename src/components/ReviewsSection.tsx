import { Review, SiteContent } from "@/lib/types";

export default function ReviewsSection({
  site,
  reviews,
}: {
  site: SiteContent;
  reviews: Review[];
}) {
  return (
    <section id="reviews">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="kicker">{site.reviewsKicker}</span>
          <h2>{site.reviewsHeading}</h2>
          <p>{site.reviewsSubtext}</p>
        </div>

        <div className="trust-banner reveal">
          <div className="tb-text">
            <p>{site.trustBannerText}</p>
          </div>
          <div className="tb-num">
            {site.trustBannerNumber}
            <small>{site.trustBannerNumberLabel}</small>
          </div>
        </div>

        <div className="reviews">
          {reviews.map((r) => (
            <div className="review reveal" key={r.id}>
              <div className="stars">{"★".repeat(r.stars)}</div>
              <blockquote>{r.quote}</blockquote>
              <div className="meta">
                <div className="job">{r.jobTitle}</div>
                <div className="facts">{r.facts}</div>
                <div className="endorse">
                  {r.endorsements
                    .split(",")
                    .map((e) => e.trim())
                    .filter(Boolean)
                    .map((e, i) => (
                      <span key={i}>{e}</span>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
