async function loadFriends(){
  try{
    const r=await fetch("/api/friends"),d=await r.json();
    const byKey={};
    (d.friends||[]).forEach(f=>byKey[f.key]=f);
    document.querySelectorAll(".friend-tile").forEach(tile=>{
      const key=new URL(tile.href).searchParams.get("friend");
      const f=byKey[key];
      const av=tile.querySelector(".tile-avatar");
      if(f?.profile_image_url)av.innerHTML=`<img src="${f.profile_image_url}" alt="${f.display_name}">`;
    });
  }catch{}
}
loadFriends();
