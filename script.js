const TWITCH_CHANNEL="Arnimane";
const parent=window.location.hostname||"localhost";
document.getElementById("twitchPlayer").src=`https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${parent}&muted=false`;
document.getElementById("twitchChat").src=`https://www.twitch.tv/embed/${TWITCH_CHANNEL}/chat?parent=${parent}&darkpopout`;

setupMobileFollow();

function setupMobileFollow(){
  const btn=document.getElementById("followBtn");
  const menu=document.getElementById("followMenu");
  if(!btn||!menu)return;
  btn.addEventListener("click",e=>{e.stopPropagation();menu.classList.toggle("open")});
  document.addEventListener("click",e=>{if(!menu.contains(e.target)&&e.target!==btn)menu.classList.remove("open")});
}
function esc(t=""){return String(t).replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[s]))}
function formatDate(d){return new Date(d).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}
function durationLabel(seconds){const m=Math.floor(seconds/60),s=Math.floor(seconds%60);return `${m}:${String(s).padStart(2,"0")}`}
function compactNumber(n){if(n===undefined||n===null||n==="")return"—";return Intl.NumberFormat(undefined,{notation:"compact",maximumFractionDigits:1}).format(Number(n))}
function videoCard(v,isShort=false){return `<article class="${isShort?"short-card":"video-card"}"><a href="${v.url}" target="_blank" rel="noreferrer"><div class="thumb"><img src="${v.thumbnail}" alt=""><span class="duration">${isShort?"":durationLabel(v.durationSeconds)}</span></div><h3>${esc(v.title)}</h3><small>${formatDate(v.publishedAt)}</small></a></article>`}
const pagerState = {
  videosGrid: { items: [], page: 0, desktopPerPage: 6, mobilePerPage: 1, isShort: false },
  shortsGrid: { items: [], page: 0, desktopPerPage: 4, mobilePerPage: 1, isShort: true }
};

function currentPerPage(state) {
  return window.matchMedia("(max-width: 620px)").matches ? state.mobilePerPage : state.desktopPerPage;
}

function renderPager(id) {
  const state = pagerState[id];
  const el = document.getElementById(id);
  if (!state || !el) return;

  const perPage = currentPerPage(state);
  const totalPages = Math.max(1, Math.ceil(state.items.length / perPage));
  state.page = ((state.page % totalPages) + totalPages) % totalPages;

  const start = state.page * perPage;
  const pageItems = state.items.slice(start, start + perPage);

  el.innerHTML = pageItems.map(v => videoCard(v, state.isShort)).join("") ||
    `<p class="loading">No ${state.isShort ? "Shorts" : "videos"} found.</p>`;

  el.dataset.page = `${state.page + 1} / ${totalPages}`;
}

function setupCarouselButtons(){
  document.querySelectorAll(".arrow-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      const id = btn.dataset.carousel;
      if (!pagerState[id]) return;
      pagerState[id].page += Number(btn.dataset.dir || 1);
      renderPager(id);
    });
  });
}
async function loadUploads(){
  try{
    const r=await fetch("/api/youtube"),d=await r.json();
    if(!r.ok)throw new Error(d.error||"Could not load uploads");
    const videos=d.videos||[],shorts=d.shorts||[],stats=d.stats||{};
    pagerState.videosGrid.items = videos;
    pagerState.videosGrid.page = 0;
    pagerState.shortsGrid.items = shorts;
    pagerState.shortsGrid.page = 0;
    renderPager("videosGrid");
    renderPager("shortsGrid");
    document.getElementById("ytSubs").textContent=stats.hiddenSubscriberCount?"Hidden":compactNumber(stats.subscriberCount);
    document.getElementById("ytViews").textContent=compactNumber(stats.viewCount);
    document.getElementById("ytVideos").textContent=compactNumber(stats.videoCount);
  }catch(e){
    document.getElementById("videosGrid").innerHTML="<p class='loading'>Add your YouTube API environment variables in Vercel to load videos.</p>";
    document.getElementById("shortsGrid").innerHTML="<p class='loading'>Shorts will appear here after setup.</p>";
  }
  setupCarouselButtons();
}
async function loadTwitchStatus(){
  try{
    const r=await fetch("/api/twitch-status"),d=await r.json();
    const hero=document.querySelector(".hero");
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
      document.getElementById("twitchLive").textContent="LIVE";
    }else{
      hero.classList.remove("is-live");
      badge.textContent="● OFFLINE";
      badge.classList.remove("online");
      chat.classList.remove("show");
      document.getElementById("heroLiveLabel").innerHTML="<span></span> OFFLINE";
      document.getElementById("heroHeadline").innerHTML="JOIN THE<br><em>CHAOS</em>";
      document.getElementById("heroSubtext").textContent="Catch the latest uploads, Shorts, and stream highlights.";
      document.getElementById("streamStatus").textContent="Offline right now — check out the latest uploads.";
    }
  }catch{
    document.getElementById("streamStatus").textContent="Live status ready to connect.";
  }
}
async function loadFriendAvatars(){
  try{
    const r=await fetch("/api/friends"),d=await r.json();
    const map={};
    (d.friends||[]).forEach(f=>map[f.key]=f);
    document.querySelectorAll("#homeFriends a").forEach(a=>{
      const key=new URL(a.href).searchParams.get("friend");
      const f=map[key];
      const avatar=a.querySelector(".friend-avatar-mini");
      if(f?.profile_image_url&&avatar)avatar.innerHTML=`<img src="${f.profile_image_url}" alt="${f.display_name}">`;
    });
  }catch{}
}
loadUploads();loadTwitchStatus();loadFriendAvatars();


window.addEventListener("resize", () => {
  renderPager("videosGrid");
  renderPager("shortsGrid");
});
