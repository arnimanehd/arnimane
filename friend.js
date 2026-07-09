const friends={
  jmmackle:{
    name:"JMMackle",
    emoji:"🧢",
    bio:"JMMackle is one of Arnimane’s regular chaos partners — the kind of friend who turns a normal game plan into a highlight reel of bad ideas, loud laughs, and unforgettable moments.",
    links:[
      ["Twitch","https://www.twitch.tv/jmmackle"],
      ["YouTube","https://www.youtube.com/results?search_query=JMMackle"],
      ["TikTok","https://www.tiktok.com/search?q=JMMackle"]
    ]
  },
  mortuarykittenx:{
    name:"MortuaryKittenx",
    emoji:"🔪",
    bio:"MortuaryKittenx brings killer energy, horror vibes, and plenty of chaotic fun. Whether it’s scares, survival, or co-op disasters, she fits right into the madness.",
    links:[
      ["Twitch","https://www.twitch.tv/mortuarykittenx"],
      ["YouTube","https://www.youtube.com/results?search_query=MortuaryKittenx"],
      ["TikTok","https://www.tiktok.com/search?q=MortuaryKittenx"]
    ]
  },
  matt:{
    name:"Matt",
    emoji:"😎",
    bio:"Matt is part of the extended chaos crew — always ready for jokes, gameplay moments, and the kind of unpredictable energy that makes streams better.",
    links:[
      ["Twitch","https://www.twitch.tv/search?term=Matt"],
      ["YouTube","https://www.youtube.com/results?search_query=Matt+gaming"],
      ["TikTok","https://www.tiktok.com/search?q=Matt%20gaming"]
    ]
  },
  wolfie:{
    name:"Wolfie",
    emoji:"🐺",
    bio:"Wolfie brings the pack energy to the stream — a fun chaos teammate who keeps the games moving, the jokes rolling, and the moments unpredictable.",
    links:[
      ["Twitch","https://www.twitch.tv/search?term=Wolfie"],
      ["YouTube","https://www.youtube.com/results?search_query=Wolfie+gaming"],
      ["TikTok","https://www.tiktok.com/search?q=Wolfie%20gaming"]
    ]
  }
};
const params=new URLSearchParams(location.search);
const key=(params.get("friend")||"wolfie").toLowerCase();
const f=friends[key]||friends.wolfie;
document.title=`${f.name} | Arnimane`;
document.getElementById("friendAvatar").textContent=f.emoji;
document.getElementById("friendName").textContent=f.name;
document.getElementById("friendBio").textContent=f.bio;
document.getElementById("friendLinks").innerHTML=f.links.map(([label,url])=>`<a href="${url}" target="_blank" rel="noreferrer">${label} →</a>`).join("");
