const TWITCH_CHANNEL="Arnimane";
const parent=window.location.hostname||"localhost";
document.getElementById("twitchPlayer").src=`https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${parent}&muted=false`;
document.getElementById("twitchChat").src=`https://www.twitch.tv/embed/${TWITCH_CHANNEL}/chat?parent=${parent}&darkpopout`;

function esc(t=""){return String(t).replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[s]))}
function formatDate(d){return new Date(d).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}
function durationLabel(seconds){const m=Math.floor(seconds/60),s=Math.floor(seconds%60);return `${m}:${String(s).padStart(2,"0")}`}
function compactNumber(n){if(n===undefined||n===null||n==="")return"—";return Intl.NumberFormat(undefined,{notation:"compact",maximumFractionDigits:1}).format(Number(n))}
function videoCard(v,isShort=false){return `<article class="${isShort?"short-card":"video-card"}"><a href="${v.url}" target="_blank" rel="noreferrer"><div class="thumb"><img src="${v.thumbnail}" alt=""><span class="duration">${isShort?"":durationLabel(v.durationSeconds)}</span></div><h3>${esc(v.title)}</h3><small>${formatDate(v.publishedAt)}</small></a></article>`}

async function loadUploads(){
  try{
    const r=await fetch("/api/youtube"),d=await r.json();
    if(!r.ok)throw new Error(d.error||"Could not load uploads");
    const videos=d.videos||[],shorts=d.shorts||[],stats=d.stats||{};
    document.getElementById("videosGrid").innerHTML=videos.slice(0,6).map(v=>videoCard(v,false)).join("")||"<p class='loading'>No videos found.</p>";
    document.getElementById("shortsGrid").innerHTML=shorts.slice(0,4).map(v=>videoCard(v,true)).join("")||"<p class='loading'>No Shorts found.</p>";
    document.getElementById("ytSubs").textContent=stats.hiddenSubscriberCount?"Hidden":compactNumber(stats.subscriberCount);
    document.getElementById("ytViews").textContent=compactNumber(stats.viewCount);
    document.getElementById("ytVideos").textContent=compactNumber(stats.videoCount);
  }catch(e){
    document.getElementById("videosGrid").innerHTML="<p class='loading'>Add your YouTube API environment variables in Vercel to load videos.</p>";
    document.getElementById("shortsGrid").innerHTML="<p class='loading'>Shorts will appear here after setup.</p>";
  }
}

async function loadTwitchStatus(){
  try{
    const r=await fetch("/api/twitch-status"),d=await r.json();
    const hero=document.getElementById("hero");
    const badge=document.getElementById("liveBadge");
    const chat=document.getElementById("chatPanel");
    if(d?.title)document.getElementById("streamTitle").textContent=d.title;
    if(d?.live){
      hero.classList.add("is-live");
      badge.textContent="● LIVE";
      badge.classList.add("online");
      chat.classList.add("show");
      document.getElementById("heroLiveLabel").innerHTML="<span></span> LIVE NOW";
      document.getElementById("heroHeadline").innerHTML="STREAMING<br><em>RIGHT NOW</em>";
      document.getElementById("heroSubtext").textContent="The chaos is live. Jump into chat with the Arnimaniacs.";
      document.getElementById("streamStatus").textContent=`Playing ${d.game||"games"}${d.viewers?` with ${d.viewers.toLocaleString()} viewers`:""}`;
      document.getElementById("twitchLive").textContent=d.viewers?`${compactNumber(d.viewers)} LIVE`:"LIVE";
    }else{
      hero.classList.remove("is-live");
      badge.textContent="● OFFLINE";
      badge.classList.remove("online");
      chat.classList.remove("show");
      document.getElementById("heroLiveLabel").innerHTML="<span></span> OFFLINE";
      document.getElementById("heroHeadline").innerHTML="JOIN THE<br><em>CHAOS</em>";
      document.getElementById("heroSubtext").textContent="Catch the latest uploads, Shorts, and stream highlights.";
      document.getElementById("streamStatus").textContent="Offline right now — check out the latest uploads.";
      document.getElementById("twitchLive").textContent="OFFLINE";
    }
  }catch{
    document.getElementById("streamStatus").textContent="Live status ready to connect.";
    document.getElementById("twitchLive").textContent="—";
  }
}
loadUploads();
loadTwitchStatus();
