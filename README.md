# Arnimane 4K Background Vercel Website

This version uses a real 3840x2160 WebP background at assets/background.webp, so it avoids the checker/grid issue across different monitors.

Required Vercel Environment Variables:
YOUTUBE_API_KEY
YOUTUBE_CHANNEL_ID

Optional:
TWITCH_CLIENT_ID
TWITCH_CLIENT_SECRET
TWITCH_CHANNEL=Arnimane


## Optimized update

This version replaces the heavy 4K background with an optimized 1920x1080 WebP and removes expensive CSS effects like fixed background attachment and backdrop blur. It should feel much smoother, especially on monitors with higher scaling, laptops, and mobile.


## Upgrade notes

Added:
- Animated neon hero glow
- True Twitch live/offline hero changes
- Twitch chat embed appears when live
- Smooth page fade + hover animations
- Friends section with individual bio pages
- YouTube auto stats: subscribers, views, video count
- Twitch live status/viewers when Twitch API env vars are connected
- Schedule updated to Tuesday-Sunday 8 PM EST
- Videos section now shows 6 videos
- Social handles updated
- Removed follow button, new crew wording, and "Made in the neon hours"

Note: YouTube stats auto-update from the YouTube Data API. Twitch live/viewer status auto-updates with Twitch Client ID/Secret. Twitch follower count is not included because Twitch restricts follower APIs beyond a simple public app token.


## Latest update

Added:
- Arrows/carousel scrolling for Videos and Shorts on the homepage
- Desktop page navigation: Videos, Shorts, Friends, Schedule, About
- Mobile keeps anchor-style navigation on the homepage
- Mobile-only Follow dropdown restored
- Desktop hero layout: live status left, larger Twitch player center, logo right
- Friends page added
- Friend detail pages still work
- Matt removed from friends
- Monday OFF added to schedule
- Twitch avatars auto-load for friends when Twitch env vars are configured
- Twitch stats show live/offline, live viewers, and current game

Note about Twitch stats:
Twitch live viewers, current game, stream title, and avatars work with app credentials.
Twitch follower count requires user OAuth permissions and is not included by default.


## Live chat overlay update

When Twitch live status says you're live, the Twitch chat now appears over the logo area. The logo remains visible as a faded background inside the chat panel instead of disappearing completely.


## Frosted chat overlay update

The live Twitch chat overlay now uses:
- Logo visible at roughly 25–30% opacity
- Subtle logo blur
- Translucent black/frosted overlay
- Strong purple neon border and glow
- Twitch chat floating above the logo background


## Latest update

- Centered the About and Friends buttons on desktop.
- Removed Twitch live/viewer/game stats from the bottom stats bar.
- Bottom stats now focus on YouTube: subscribers, views, and video count.
- Replaced text social symbols with SVG logo-style icons for Twitch, YouTube, TikTok, Instagram, and X.
- Icons are recolored to match the purple neon branding.


## Friend socials update

Updated friend pages with provided social links:

JMMackle:
- Twitch: JMMackle
- TikTok: JMMackle
- YouTube: JMMackle
- Instagram: JMMackle
- Discord invite

MortuaryKittenx:
- Twitch: MortuaryKittenx
- TikTok: mortuarykittenx
- YouTube channel URL
- Instagram: mortuarykittenx.ttv
- X: mortuarykittenx
- Discord invite

Wolfie:
- Twitch: mr_wildwolfie
- TikTok URL
- YouTube channel URL
- X URL
- Discord invite


## Sanity News & Announcements

- Homepage featured announcement
- Recent announcements
- Dedicated `/news.html` archive
- Filters for stream, video, schedule, and community posts
- Optional images and buttons
- Sanity editing dashboard in `sanity-studio/`

Vercel variables:

```text
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
```

See `sanity-studio/README.md` for setup.


## Layout refinement update

- Homepage announcement is now constrained and centered instead of spanning ultra-wide screens.
- Desktop News page uses a clean full-width vertical announcement feed.
- Announcement cards without images no longer reserve an empty image column.
- Mobile navigation is now a compact menu rather than a horizontally scrolling link strip.
- Mobile header hides while scrolling down and returns while scrolling up.
- Selecting a mobile anchor closes and hides the header.
- About controller is aligned beside the Learn More button.


## Announcement loading fix

The homepage announcement loader now uses uniquely named functions and variables so it does not conflict with the main website JavaScript. The announcement script reference also uses a new cache version.
