const btn=document.getElementById("followBtn");
const menu=document.getElementById("followMenu");
if(btn&&menu){
  btn.addEventListener("click",e=>{e.stopPropagation();menu.classList.toggle("open")});
  document.addEventListener("click",e=>{if(!menu.contains(e.target)&&e.target!==btn)menu.classList.remove("open")});
}
