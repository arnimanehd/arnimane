const friends = {
  jmmackle: {
    name: "JMMackle",
    emoji: "🧢",
    twitch: "jmmackle",
    bio: "JMMackle is one of Arnimane’s regular chaos partners — the kind of friend who turns a normal game plan into a highlight reel of bad ideas, loud laughs, and unforgettable moments.",
    links: [
      { label: "Twitch", type: "twitch", url: "https://www.twitch.tv/JMMackle" },
      { label: "TikTok", type: "tiktok", url: "https://www.tiktok.com/@JMMackle" },
      { label: "YouTube", type: "youtube", url: "https://www.youtube.com/@JMMackle" },
      { label: "Instagram", type: "instagram", url: "https://www.instagram.com/JMMackle" },
      { label: "Discord", type: "discord", url: "https://discord.com/invite/Kh5rZBF9g3" }
    ]
  },

  mortuarykittenx: {
    name: "MortuaryKittenx",
    emoji: "🔪",
    twitch: "mortuarykittenx",
    bio: "MortuaryKittenx brings killer energy, horror vibes, and plenty of chaotic fun. Whether it’s scares, survival, or co-op disasters, she fits right into the madness.",
    links: [
      { label: "Twitch", type: "twitch", url: "https://www.twitch.tv/MortuaryKittenx" },
      { label: "TikTok", type: "tiktok", url: "https://www.tiktok.com/@mortuarykittenx" },
      { label: "YouTube", type: "youtube", url: "https://www.youtube.com/channel/UCBDlGBOGlKaTGFPoC5aonIA" },
      { label: "Instagram", type: "instagram", url: "https://www.instagram.com/mortuarykittenx.ttv" },
      { label: "X", type: "x", url: "https://twitter.com/mortuarykittenx" },
      { label: "Discord", type: "discord", url: "https://discord.com/invite/Kh5rZBF9g3" }
    ]
  },

  wolfie: {
    name: "Wolfie",
    emoji: "🐺",
    twitch: "mr_wildwolfie",
    bio: "Wolfie brings the pack energy to the stream — a fun chaos teammate who keeps the games moving, the jokes rolling, and the moments unpredictable.",
    links: [
      { label: "Twitch", type: "twitch", url: "https://www.twitch.tv/mr_wildwolfie" },
      { label: "TikTok", type: "tiktok", url: "https://www.tiktok.com/@mr_wildwolfie" },
      { label: "YouTube", type: "youtube", url: "https://www.youtube.com/channel/UCXNRAQYAY8rsaa84jeFAjDQ?sub_confirmation=1" },
      { label: "X", type: "x", url: "https://twitter.com/Mr_WildWolfie" },
      { label: "Discord", type: "discord", url: "https://discord.gg/3FUzrVyu3p" }
    ]
  }
};

function iconClass(type) {
  return {
    twitch: "icon-twitch",
    youtube: "icon-youtube",
    tiktok: "icon-tiktok",
    instagram: "icon-instagram",
    x: "icon-x",
    discord: "icon-discord"
  }[type] || "";
}

const params = new URLSearchParams(location.search);
const key = (params.get("friend") || "wolfie").toLowerCase();
const f = friends[key] || friends.wolfie;

document.title = `${f.name} | Arnimane`;
document.getElementById("friendAvatar").textContent = f.emoji;
document.getElementById("friendName").textContent = f.name;
document.getElementById("friendBio").textContent = f.bio;

document.getElementById("friendLinks").innerHTML = f.links.map(link => `
  <a class="friend-social-button" href="${link.url}" target="_blank" rel="noreferrer">
    <span class="brand-icon ${iconClass(link.type)}" aria-hidden="true"></span>
    ${link.label}
    <b>→</b>
  </a>
`).join("");

async function loadAvatar() {
  try {
    const r = await fetch("/api/friends");
    const d = await r.json();
    const found = (d.friends || []).find(x => x.key === key);
    if (found?.profile_image_url) {
      document.getElementById("friendAvatar").innerHTML =
        `<img src="${found.profile_image_url}" alt="${found.display_name}">`;
    }
  } catch {}
}

loadAvatar();
