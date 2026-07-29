// Shared content types used by both the public site and the dashboard.
// Lists (tags, stack, endorsements, etc.) are stored as plain comma-separated
// strings on purpose — keeps the Firestore schema and the dashboard forms simple.

export interface Profile {
  brandInitials: string; // e.g. "SMAS"
  name: string;
  title: string;
  location: string;
  badges: string; // comma-separated, e.g. "★ TOP RATED PLUS · 100% JOB SUCCESS, DUBAI, UAE"
  heroHeadingBefore: string; // "Eleven years of shipping software."
  heroHeadingHighlight: string; // "Twelve industries"
  heroHeadingAfter: string; // "and counting."
  heroLede: string;
  portraitUrl: string;
  portraitTag: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  stats: StatItem[];
  aboutParagraphs: string; // separate paragraphs with a blank line
  credentials: CredentialRow[];
  contactHeading: string;
  contactText: string;
  contactLinks: ContactLink[];
}

export interface StatItem {
  value: string;
  label: string;
}

export interface CredentialRow {
  label: string;
  value: string;
  gold?: boolean;
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
}

export interface SiteContent {
  navCtaLabel: string;
  navCtaHref: string;
  workKicker: string;
  workHeading: string;
  workSubtext: string;
  reviewsKicker: string;
  reviewsHeading: string;
  reviewsSubtext: string;
  trustBannerText: string;
  trustBannerNumber: string;
  trustBannerNumberLabel: string;
  capabilitiesKicker: string;
  capabilitiesHeading: string;
  aboutKicker: string;
  aboutHeading: string;
  footerLeft: string;
  footerRight: string;
}

export interface Project {
  id: string;
  title: string;
  coverWord: string;
  kicker: string;
  markText: string;
  color1: string;
  color2: string;
  metric: string;
  description: string;
  stack: string; // comma-separated
  liveLabel?: string;
  liveUrl?: string;
  categories: string; // comma-separated: ai, saas, realtime, apps
  imageUrl?: string; // project screenshot
  sortOrder: number;
  published: boolean;
}

export interface Review {
  id: string;
  stars: number;
  quote: string;
  jobTitle: string;
  facts: string;
  endorsements: string; // comma-separated
  sortOrder: number;
}

export interface Capability {
  id: string;
  number: string;
  heading: string;
  description: string;
  list: string; // comma-separated
  sortOrder: number;
}
