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
