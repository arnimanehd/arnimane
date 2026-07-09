async function twitchToken(clientId, clientSecret) {
  const url = new URL("https://id.twitch.tv/oauth2/token");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("client_secret", clientSecret);
  url.searchParams.set("grant_type", "client_credentials");

  const response = await fetch(url, { method: "POST" });
  if (!response.ok) throw new Error("Could not get Twitch token.");
  return response.json();
}

const configuredFriends = [
  { key: "jmmackle", login: "jmmackle", fallbackName: "JMMackle" },
  { key: "mortuarykittenx", login: "mortuarykittenx", fallbackName: "MortuaryKittenx" },
  { key: "wolfie", login: "mr_wildwolfie", fallbackName: "Wolfie" }
];

module.exports = async function handler(req, res) {
  try {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        friends: configuredFriends.map(f => ({
          key: f.key,
          login: f.login,
          display_name: f.fallbackName,
          profile_image_url: null
        }))
      }));
      return;
    }

    const token = await twitchToken(clientId, clientSecret);
    const url = new URL("https://api.twitch.tv/helix/users");
    configuredFriends.forEach(f => url.searchParams.append("login", f.login));

    const response = await fetch(url, {
      headers: {
        "Client-ID": clientId,
        "Authorization": `Bearer ${token.access_token}`
      }
    });

    const data = await response.json();
    const byLogin = {};
    (data.data || []).forEach(u => byLogin[u.login.toLowerCase()] = u);

    const friends = configuredFriends.map(f => {
      const u = byLogin[f.login.toLowerCase()];
      return {
        key: f.key,
        login: f.login,
        display_name: u?.display_name || f.fallbackName,
        profile_image_url: u?.profile_image_url || null,
        twitch_url: `https://www.twitch.tv/${f.login}`
      };
    });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.end(JSON.stringify({ friends }));
  } catch (err) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
      friends: configuredFriends.map(f => ({
        key: f.key,
        login: f.login,
        display_name: f.fallbackName,
        profile_image_url: null
      })),
      error: err.message
    }));
  }
};
