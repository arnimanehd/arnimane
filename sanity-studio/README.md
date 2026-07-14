# Arnimane News Studio

1. Create a Sanity project.
2. Replace `PASTE_YOUR_SANITY_PROJECT_ID` in `sanity.config.ts` and `sanity.cli.ts`.
3. In this folder run:

```bash
npm install
npm run dev
```

4. Create and publish an Announcement.
5. To put your editor online, run:

```bash
npm run deploy
```

Add these to the main website in Vercel:

```text
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
```

Redeploy the website once. After that, new announcements publish from Sanity without GitHub uploads or website redeployments.
