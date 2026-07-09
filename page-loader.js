function esc(t=""){return String(t).replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[s]))}
function formatDate(d){return new Date(d).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}
function durationLabel(seconds){const m=Math.floor(seconds/60),s=Math.floor(seconds%60);return `${m}:${String(s).padStart(2,"0")}`}
function videoCard(v,isShort=false){return `<article class="${isShort?"short-card":"video-card"}"><a href="${v.url}" target="_blank" rel="noreferrer"><div class="thumb"><img src="${v.thumbnail}" alt=""><span class="duration">${isShort?"":durationLabel(v.durationSeconds)}</span></div><h3>${esc(v.title)}</h3><small>${formatDate(v.publishedAt)}</small></a></article>`}
async function loadPageUploads(){
  const vg=document.getElementById("videosGrid"),sg=document.getElementById("shortsGrid");
  if(!vg&&!sg)return;
  try{
    const r=await fetch("/api/youtube"),d=await r.json();
    if(!r.ok)throw new Error();
    if(vg)vg.innerHTML=(d.videos||[]).map(v=>videoCard(v,false)).join("");
    if(sg)sg.innerHTML=(d.shorts||[]).map(v=>videoCard(v,true)).join("");
  }catch{
    if(vg)vg.innerHTML="<p class='loading'>Add your YouTube API environment variables in Vercel to load videos.</p>";
    if(sg)sg.innerHTML="<p class='loading'>Shorts will appear here after setup.</p>";
  }
}
loadPageUploads();
