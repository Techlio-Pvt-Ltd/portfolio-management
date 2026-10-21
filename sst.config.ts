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
  "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
] as const;

export default $config({
  app(input) {
    return {
      name: "amer-portfolio",
      removal: "remove",
      protect: false,
      home: "aws",
      providers: {
        aws: { region: "us-east-1" },
      },
    };
  },
  async run() {
    const missing = PUBLIC_ENV.filter((key) => !process.env[key]);
    if (missing.length) {
      throw new Error(
        `Missing env vars: ${missing.join(", ")}. Add them to .env.${$app.stage} or export them before deploying.`,
      );
    }

    const site = new sst.aws.Nextjs("AmerPortfolio", {
      environment: Object.fromEntries(
        PUBLIC_ENV.map((key) => [key, process.env[key]!]),
      ),
      // Uncomment to serve from your own domain (DNS hosted in Route 53).
      // For DNS hosted elsewhere, see https://sst.dev/docs/custom-domains
      // domain: "example.com",
    });

    return { url: site.url };
  },
});
