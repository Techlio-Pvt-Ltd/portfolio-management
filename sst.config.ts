// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

// Public config baked into the Next.js build. SST loads these from `.env` /
// `.env.<stage>` (e.g. `.env.production`) or from the shell, e.g. in CI.
const PUBLIC_ENV = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
] as const;

// Server-only secrets — attached to the Lambda environment but never shipped
// to the browser bundle (no NEXT_PUBLIC_ prefix). Used by API routes.
const SERVER_ENV = [
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "ADMIN_UID",
] as const;

export default $config({
  app(input) {
    return {
      name: "mahsam-portfolio",
      removal: "remove",
      protect: false,
      home: "aws",
      providers: {
        aws: { region: "us-east-1" },
      },
    };
  },
  async run() {
    const missing = [...PUBLIC_ENV, ...SERVER_ENV].filter((key) => !process.env[key]);
    if (missing.length) {
      throw new Error(
        `Missing env vars: ${missing.join(", ")}. Add them to .env.${$app.stage} or export them before deploying.`,
      );
    }

    const site = new sst.aws.Nextjs("MahsamPortfolio", {
      environment: Object.fromEntries(
        [...PUBLIC_ENV, ...SERVER_ENV].map((key) => [key, process.env[key]!]),
      ),
      // DNS is managed by hand in Cloudflare, so SST only attaches the domain
      // and this ACM certificate (us-east-1) to the CloudFront distribution.
      domain: {
        name: "mahsamabbas.com",
        aliases: ["www.mahsamabbas.com"],
        dns: false,
        cert: "arn:aws:acm:us-east-1:225989335286:certificate/9b280bc6-6bb2-496d-8370-8b208c452119",
      },
    });

    return { url: site.url };
  },
});
