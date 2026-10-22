# Amer Portfolio

Next.js + Firebase rebuild of the portfolio site with a login-protected `/dashboard`
for managing every piece of content shown on the public page (profile, hero, stats,
projects, reviews, capabilities, about, contact, nav, and footer text).

## 1. Firebase project setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project (free Spark plan is enough).
2. **Add a Web App** (</> icon) to the project. Copy the config values shown — you'll need them in step 2.
3. **Authentication** → Sign-in method → enable **Email/Password**.
4. **Authentication** → Users → **Add user** — create your dashboard admin account:
   - Enter an email address (e.g., your email)
   - Enter a secure password
   - Click **Add user**
   - **Important**: Remember these credentials — you'll use them to log into `/dashboard`
5. **Firestore Database** → Create database (production mode is fine, any region).
   - Go to the **Rules** tab and paste the contents of `firestore.rules` from this repo, then Publish.

## 1.5. Cloudinary setup (for image uploads)

1. Go to [cloudinary.com](https://cloudinary.com) and sign up for a free account.
2. On the **Dashboard** home page, find the **Product Environment Credentials** box and note the three values: **Cloud name**, **API Key**, and **API Secret** (click the eye icon to reveal it).
3. Uploads are **signed**: the dashboard calls `/api/cloudinary-sign`, which requires your dashboard login and signs each upload with the API secret on the server. No upload preset is needed, and strangers can't upload to your account.

## 2. Local setup

```bash
npm install
cp env.example .env.local   # PowerShell: Copy-Item env.example .env.local
```

Fill in `.env.local` with:
- Firebase config values from step 1.2
- Cloudinary cloud name, API key, and API secret from step 1.5.2

**Note**: `.env.local` is for local development only. For production, you'll set these as environment variables in your hosting platform (see step 5).

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard) — log in with the user created in step 1.4.

## 3. Load the default content

The site works out of the box using bundled default content (copied from the
original design) even before Firestore has any data. To make that content
**editable**, load it into Firestore once:

1. Log into `/dashboard`.
2. Go to the **Setup** tab.
3. Click **Seed default content**. This only fills collections that are empty, so it's safe to click again later.

## 4. Editing content

Everything visible on the site is editable from `/dashboard`, no code changes or redeploys required:

- **Profile** — hero text, badges, stats, portrait image, about paragraphs, credentials, contact links.
- **Site Content** — nav links, section kickers/headings/subtext, footer text.
- **Projects** — add/edit/delete/reorder case studies, toggle published on/off.
- **Reviews** — add/edit/delete testimonials.
- **Capabilities** — add/edit/delete the three (or more) capability cards.

Saves write directly to Firestore and trigger the public page to refresh immediately.

## 5. Deploy

### Recommended: Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Add the following environment variables in Vercel's project settings:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Click Deploy.
5. After deployment, visit `/dashboard` and click "Seed default content" to load the initial data.

Future `git push`es will auto-deploy. Content edits in the dashboard never require a redeploy.

### Alternative: AWS (serverless, via SST)

Deploys to Lambda + CloudFront + S3 using [SST](https://sst.dev) and
[OpenNext](https://opennext.js.org/aws). At portfolio-level traffic this stays
within AWS's always-free tiers. The only fixed cost is $0.50/month if you host DNS in Route 53.

1. Install the AWS CLI and sign in with an account that can create resources: `aws configure` (or `aws sso login`).
2. Put the environment variables in `.env.production`. SST reads this file for the `production` stage, and so does `next build`:
   ```bash
   cp .env.local .env.production
   ```
3. Deploy:
   ```bash
   npm run deploy
   ```
   The site URL (`https://xxxx.cloudfront.net`) is printed at the end.
4. Optional: to use a custom domain, set `domain` in `sst.config.ts` and deploy again.

Notes:
- Infrastructure lives in `sst.config.ts`. Region is `us-east-1`; change `providers.aws.region` there if your Firestore database is elsewhere.
- The `production` stage is protected and its resources are retained. To tear it down, set `protect: false` and run `npx sst remove --stage production`.
- Dashboard edits can take up to ~60 seconds to appear, while CloudFront serves the cached page.

### Alternative: Netlify

1. Push this repo to GitHub.
2. Go to [app.netlify.com](https://app.netlify.com) and add a new site from Git.
3. Add the same environment variables listed above in Netlify's site settings.
4. Deploy.

### Alternative: Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase login` to authenticate.
3. Run `firebase init hosting` in the project root.
4. Configure `firebase.json` to build the Next.js app.
5. Run `firebase deploy`.

## Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Backend/Database**: Firebase
  - Firestore (content storage)
  - Authentication (dashboard login)
- **Image Hosting**: Cloudinary (signed uploads for project images)
- **Deployment**: Vercel (recommended), AWS via SST, Netlify, or Firebase Hosting
- **Styling**: Custom CSS with CSS variables

## Required Environment Variables

The following environment variables must be set in `.env.local` for local development and in your hosting platform's environment variables for production:

### Server
- `PORT` — Optional in `.env.local`. Defaults to `3000` if unset.

### Firebase (required)
- `NEXT_PUBLIC_FIREBASE_API_KEY` — Your Firebase project API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` — Your Firebase auth domain (e.g., `project-id.firebaseapp.com`)
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` — Your Firebase project ID
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` — Your Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` — Your Firebase app ID
- `ADMIN_UID` — Your admin user's UID (Firebase Console → Authentication → Users → User UID column). API routes and Firestore rules only trust this account — self-registered users can't call them. The same UID is hardcoded in `firestore.rules` and `storage.rules`.

### Cloudinary (required for image uploads)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` — Your Cloudinary API key (server-only)
- `CLOUDINARY_API_SECRET` — Your Cloudinary API secret (server-only)

These values are obtained from:
- Firebase: Firebase Console → Project Settings → General → Your apps → Web App
- Cloudinary: Cloudinary Dashboard → Product Environment Credentials
