import { Capability, Profile, Project, Review, SiteContent } from "./types";

// Default content for Amer Usman portfolio. Used as a fallback when Firestore
// is empty, and as the payload for the one-click "Seed default content" button.

export const defaultProfile: Profile = {
  brandInitials: "AMER.AI",
  name: "Amer Usman",
  title: "Senior AI Full-Stack Engineer",
  location: "",
  badges: "★ TOP RATED PLUS,100% JOB SUCCESS",
  heroHeadingBefore: "Building the",
  heroHeadingHighlight: "AI-powered products",
  heroHeadingAfter: "businesses run on.",
  heroLede:
    "I'm Amer Usman, a Senior AI Full-Stack Engineer with 8+ years of experience building AI-powered SaaS products, enterprise web applications, and automation platforms. I've shipped production systems across healthcare, fintech, eCommerce, CRM, ERP, government, and business operations, from AI agents and multi-tenant platforms to scalable React, Next.js, and Laravel applications. Different industries, same goal: software that's scalable, reliable, and ready for production.",
  portraitUrl: "",
  portraitTag: "● Available for new projects",
  availabilityBannerIcon: "🚀",
  availabilityBannerStatus: "SENIOR AI FULL-STACK ENGINEER · ONLINE",
  availabilityBannerHeading: "Available for New Projects",
  availabilityBannerSubtext: "Let's build something that lasts",
  ctaPrimaryLabel: "See the case studies",
  ctaPrimaryHref: "#work",
  ctaSecondaryLabel: "Get in touch",
  ctaSecondaryHref: "#contact",
  stats: [
    { value: "$300K+", label: "Earned on Upwork" },
    { value: "17,000+", label: "Hours logged" },
    { value: "8+", label: "Years shipping" },
    { value: "5.0", label: "Client rating" },
  ],
  aboutParagraphs:
    "Eight years in, my pattern is consistent: clients bring me in for one job and keep me for years. My longest engagement ran four and a half years and 9,397 hours on a single contract. My most recent yearlong contract closed at nearly 2,000 hours with a 5.0. That doesn't happen because of any one framework. It happens because the work ships on time, the code stays maintainable, and communication never goes quiet.\n\nI work across the whole product: backend services, frontend features, AI integration, and the CI/CD pipelines that deliver them. On ARProactive I introduced AI-assisted code review across a 12-developer team. On enterprise platforms like Acquia's, I worked to the security, performance, and compliance standards that large organizations demand.\n\nI've earned $300K+ and logged 17,000+ hours on Upwork with a 100% job success score and Top Rated Plus status, which Upwork reserves for the top performers on large contracts.",
  credentials: [
    { label: "Upwork status", value: "Top Rated Plus", gold: true },
    { label: "Job success", value: "100%" },
    { label: "Client rating", value: "5.0 / 5.0" },
    { label: "Total earned", value: "$300K+" },
    { label: "Hours logged", value: "17,000+" },
    { label: "Longest contract", value: "4.5 years · 9,397 hrs" },
  ],
  contactHeading: "Let's build something that lasts",
  contactText:
    "Available for AI product builds, full-stack development, and long-term engineering partnerships. The fastest way to reach me is Upwork.",
  contactLinks: [
    { label: "Upwork", value: "Top Rated Plus →", href: "#contact" },
    { label: "LinkedIn", value: "/in/your-handle →", href: "#" },
    { label: "GitHub", value: "@your-handle →", href: "#" },
    { label: "Email", value: "you@example.com", href: "mailto:you@example.com" },
  ],
};

export const defaultSiteContent: SiteContent = {
  navCtaLabel: "Hire on Upwork",
  navCtaHref: "#contact",
  workKicker: "Selected Work",
  workHeading: "Production case studies",
  workSubtext:
    "Enterprise platforms, AI-native products, and long-running systems that real businesses depend on every day.",
  reviewsKicker: "Client Reviews",
  reviewsHeading: "What clients say on Upwork",
  reviewsSubtext: "Verified reviews from real contracts. Every rating below is a 5.0.",
  trustBannerText:
    "One client kept me on the same contract for four and a half years. From February 2019 to September 2023, 9,397 hours and $149K on a single engagement building their CakePHP, Angular, and Node platform on AWS. Long-term trust, measured in hours.",
  trustBannerNumber: "9,397",
  trustBannerNumberLabel: "Hours · one client · 4.5 years",
  capabilitiesKicker: "Capabilities",
  capabilitiesHeading: "What I bring to a project",
  aboutKicker: "About",
  aboutHeading: "Why clients keep me around",
  footerLeft: "© 2026 Amer Usman",
  footerRight: "Senior AI Full-Stack Engineer",
};

export const defaultProjects: Omit<Project, "id">[] = [
  {
    title: "Digital Experience Platform",
    coverWord: "Acquia",
    kicker: "Enterprise DXP",
    markText: "AQ",
    color1: "#0E2B66",
    color2: "#1D4ED8",
    metric: "Thousands of daily users",
    description:
      "Senior full-stack work on enterprise digital experience platforms built on Drupal 10 and the AWS-backed Acquia Cloud Platform. Built backend services, integrated third-party APIs, tuned database performance, and shipped frontend features with modern JavaScript, delivered through CI/CD pipelines with automated testing for high-availability enterprise environments.",
    stack: "Drupal 10,PHP,Laravel,React,MySQL,REST APIs,AWS,Docker,GitHub Actions",
    liveLabel: "acquia.com →",
    liveUrl: "https://www.acquia.com",
    categories: "enterprise,laravel",
    sortOrder: 0,
    published: true,
  },
  {
    title: "CRM Engineering at Scale",
    coverWord: "ARProactive",
    kicker: "CRM Platform",
    markText: "AR",
    color1: "#7C2D12",
    color2: "#EA580C",
    metric: "Team of 12 · CI/CD owner",
    description:
      "Senior engineer on a CRM platform with an Angular frontend and Laravel/Go backend. Designed and managed the automated CI/CD pipelines on GitHub Actions, introduced AI-assisted code review workflows that cut review cycles and raised code quality, and drove backend optimization, API performance, and microservice infrastructure improvements.",
    stack: "Angular,Laravel,Go,MySQL,microservices,GitHub Actions,Docker,AWS",
    liveLabel: "arproactive.com →",
    liveUrl: "https://www.arproactive.com",
    categories: "ai,enterprise,laravel",
    sortOrder: 1,
    published: true,
  },
  {
    title: "Security Training Platform",
    coverWord: "MalDev Academy",
    kicker: "Cybersecurity EdTech",
    markText: "MD",
    color1: "#3B0764",
    color2: "#7E22CE",
    metric: "Global learner base",
    description:
      "Senior full-stack developer on an online cybersecurity training platform covering advanced security topics. Built new backend services and course management workflows, integrated Stripe payments, enhanced the student dashboard, optimized database queries, and hardened authentication and authorization for a growing international user base.",
    stack: "Laravel,PHP,React,MySQL,REST APIs,Stripe,AWS,Docker,GitHub Actions",
    liveLabel: "maldevacademy.com →",
    liveUrl: "https://maldevacademy.com",
    categories: "laravel",
    sortOrder: 2,
    published: true,
  },
  {
    title: "Dealership CRM + AI",
    coverWord: "DP360",
    kicker: "Automotive CRM",
    markText: "DP",
    color1: "#7F1D3A",
    color2: "#E11D48",
    metric: "20+ dealerships · 10K+ leads",
    description:
      "Long-term engineer on an enterprise dealership CRM with 229+ data models across CakePHP and MySQL. Worked across the Angular frontend and backend, real-time updates over Socket.io, GPT-4o powered lead and conversation summaries that cut per-lead review from 10 minutes to under 30 seconds, and Twilio, SendGrid, and Nylas communication integrations.",
    stack: "Angular,CakePHP 3,Node.js,MySQL,GPT-4o,Socket.io,Twilio,AWS ECS",
    categories: "ai,enterprise",
    sortOrder: 3,
    published: true,
  },
  {
    title: "AI-Native Messaging Platform",
    coverWord: "Signal House",
    kicker: "CPaaS · Telecom",
    markText: "SH",
    color1: "#155E75",
    color2: "#06B6D4",
    metric: "3 autonomous AI agents",
    description:
      "Engineering on an AI-native A2P messaging platform spanning the React 19 portal, Express 5 API, and typed JavaScript SDK. The platform runs three autonomous agents on the Anthropic SDK that screen 10DLC compliance submissions, optimize message routing from live delivery data, and generate audit summaries for administrators.",
    stack: "React 19,Vite,Express 5,Anthropic SDK,Claude Opus + Sonnet,JWT SDK",
    categories: "ai",
    sortOrder: 4,
    published: true,
  },
  {
    title: "Multi-Agent AI Platform",
    coverWord: "AUDOS",
    kicker: "AI-Native Startup Studio",
    markText: "AU",
    color1: "#4C1D95",
    color2: "#8B5CF6",
    metric: "3 agents · 4 model tiers",
    description:
      "Engineering on an AI-native platform that lets non-technical founders validate, launch, and run a business. Three autonomous agents handle customer engagement, business intelligence, and approval-gated operations automation, running on a tiered multi-model strategy that routes each task to the cheapest capable model.",
    stack: "GPT-4.1,GPT-4o Mini,Claude Opus,Gemini 2.5 Flash,multi-agent architecture,REST APIs",
    categories: "ai",
    sortOrder: 5,
    published: true,
  },
  {
    title: "Regulatory Intelligence",
    coverWord: "Ascent RegTech",
    kicker: "RegTech · Compliance",
    markText: "AS",
    color1: "#134E4A",
    color2: "#0D9488",
    metric: "400K+ obligations · 98 countries",
    description:
      "Engineering on a Python/Django platform that ingests regulatory content from 1,000+ sources worldwide. Work covered per-source scrapers with content fingerprinting and incremental ingestion, the PostgreSQL regulatory data model, and the search, obligation register, and change-management screens compliance teams use daily.",
    stack: "Python,Django,PostgreSQL,scraping pipeline,full-text search,GRC integrations",
    liveLabel: "ascentregtech.com →",
    liveUrl: "https://www.ascentregtech.com",
    categories: "ai,enterprise",
    sortOrder: 6,
    published: true,
  },
];

export const defaultReviews: Omit<Review, "id">[] = [
  {
    stars: 5,
    quote:
      "Amer was a great developer and important part of our project. Would definitely recommend him for your next project. Good communication, skills and participation with other team members!",
    jobTitle: "Freelance Full-Stack Developer, CakePHP / Angular / Node / AWS",
    facts: "$149,161 · 9,397 hours · 2019 to 2023",
    endorsements: "Clear Communicator,Collaborative",
    sortOrder: 0,
  },
  {
    stars: 5,
    quote:
      "Amer is an exceptional freelancer and would love to hire him again. It was a pleasure working with him, he was super fast and did quality work. Excellent communication and took great care of the code.",
    jobTitle: "Laravel and Vue Expert",
    facts: "5.0 rating · 2022",
    endorsements: "Reliable,Detail Oriented,Committed to Quality",
    sortOrder: 1,
  },
  {
    stars: 5,
    quote: "Amer was a great resource, knows Laravel and React very well. Highly recommended.",
    jobTitle: "Full-Stack Developer, Laravel / React Native, full-time EST hours",
    facts: "$6,984 · 382 hours · 2023 to 2024",
    endorsements: "5.0 Rating",
    sortOrder: 2,
  },
  {
    stars: 5,
    quote: "Thank you for the work on our project.",
    jobTitle: "PHP Developer, year-long engagement",
    facts: "$51,653 · 1,987 hours · 2025 to 2026",
    endorsements: "5.0 Rating",
    sortOrder: 3,
  },
];

export const defaultCapabilities: Omit<Capability, "id">[] = [
  {
    number: "01",
    heading: "AI products & agents",
    description:
      "I've shipped autonomous agents, streaming LLM features, and AI-assisted workflows into production platforms. Multi-model strategies keep costs under control while the intelligence goes where users feel it.",
    list: "OpenAI,Anthropic SDK,Gemini,autonomous agents,AI code review,workflow automation",
    sortOrder: 0,
  },
  {
    number: "02",
    heading: "Full-stack engineering",
    description:
      "Laravel and PHP at depth, plus React, Next.js, Angular, Vue, Node, Go, and Python. Enterprise CMS work on Drupal 10. I match the stack to the problem and keep the architecture boring where boring wins.",
    list: "Laravel,React,Next.js,Angular,Vue,CakePHP,Drupal 10,Django,Go,MySQL,PostgreSQL",
    sortOrder: 1,
  },
  {
    number: "03",
    heading: "DevOps & delivery",
    description:
      "CI/CD pipelines I design and own, containerized deploys, microservices, and cloud infrastructure on AWS. On ARProactive I ran delivery for a 12-developer team, so process is part of my toolkit, not an afterthought.",
    list: "AWS,Docker,GitHub Actions,CI/CD,microservices,Stripe,REST APIs",
    sortOrder: 2,
  },
];
