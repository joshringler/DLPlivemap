const PARK={dlp:"Disneyland Park",daw:"Disney Adventure World"};
const LAND_ORDER={dlp:["Main Street U.S.A.","Adventureland","Frontierland","Fantasyland","Discoveryland"],daw:["World Premiere Plaza","Adventure Way","Worlds of Pixar","Avengers Campus","World of Frozen"]};
const CATALOG=[
// Disneyland Park — current official attraction catalog, including closed items
["dlp","attraction","Main Street U.S.A.","Main Street Vehicles"],["dlp","attraction","Main Street U.S.A.","Disneyland Railroad Main Street Station"],["dlp","attraction","Main Street U.S.A.","Discovery Arcade"],["dlp","attraction","Main Street U.S.A.","Liberty Arcade"],["dlp","attraction","Main Street U.S.A.","Horse-Drawn Streetcars"],
["dlp","attraction","Adventureland","Adventure Isle"],["dlp","attraction","Adventureland","Alice's Curious Labyrinth"],["dlp","attraction","Adventureland","Indiana Jones™ and the Temple of Peril"],["dlp","attraction","Adventureland","La Cabane des Robinson"],["dlp","attraction","Adventureland","Le Passage Enchanté d'Aladdin"],["dlp","attraction","Adventureland","Pirates of the Caribbean"],["dlp","attraction","Adventureland","Pirate Galleon"],["dlp","attraction","Adventureland","Pirates' Beach"],
["dlp","attraction","Frontierland","Big Thunder Mountain"],["dlp","attraction","Frontierland","Phantom Manor"],["dlp","attraction","Frontierland","Thunder Mesa Riverboat Landing"],["dlp","attraction","Frontierland","Rustler Roundup Shootin' Gallery"],["dlp","attraction","Frontierland","Frontierland Playground"],
["dlp","attraction","Fantasyland","Peter Pan's Flight"],["dlp","attraction","Fantasyland","it's a small world"],["dlp","attraction","Fantasyland","Blanche-Neige et les Sept Nains®"],["dlp","attraction","Fantasyland","Les Voyages de Pinocchio"],["dlp","attraction","Fantasyland","Dumbo the Flying Elephant"],["dlp","attraction","Fantasyland","Casey Jr. – le Petit Train du Cirque"],["dlp","attraction","Fantasyland","Le Pays des Contes de Fées, presented by Vittel"],["dlp","attraction","Fantasyland","Le Carrousel de Lancelot"],["dlp","attraction","Fantasyland","La Tanière du Dragon"],["dlp","attraction","Fantasyland","Sleeping Beauty Castle"],["dlp","attraction","Fantasyland","La Galerie de la Belle au Bois Dormant"],["dlp","attraction","Fantasyland","Mad Hatter's Tea Cups"],["dlp","attraction","Fantasyland","Princess Pavilion"],
["dlp","attraction","Discoveryland","Star Wars Hyperspace Mountain"],["dlp","attraction","Discoveryland","Buzz Lightyear Laser Blast"],["dlp","attraction","Discoveryland","Star Tours: The Adventures Continue*"],["dlp","attraction","Discoveryland","Orbitron®"],["dlp","attraction","Discoveryland","Autopia, presented by Avis"],["dlp","attraction","Discoveryland","Les Mystères du Nautilus"],
// Disney Adventure World — current 2026 catalog
["daw","attraction","World Premiere Plaza","The Twilight Zone Tower of Terror"],["daw","attraction","World Premiere Plaza","World Premiere"],["daw","attraction","World Premiere Plaza","Les Tapis Volants - Flying Carpets Over Agrabah®"],["daw","attraction","Adventure Way","Raiponce Tangled Spin"],["daw","attraction","Worlds of Pixar","Ratatouille : L’Aventure Totalement Toquée de Rémy"],["daw","attraction","Worlds of Pixar","Crush's Coaster"],["daw","attraction","Worlds of Pixar","Cars ROAD TRIP"],["daw","attraction","Worlds of Pixar","Cars Quatre Roues Rallye"],["daw","attraction","Worlds of Pixar","Slinky® Dog Zigzag Spin"],["daw","attraction","Worlds of Pixar","RC Racer"],["daw","attraction","Worlds of Pixar","Toy Soldiers Parachute Drop"],["daw","attraction","Avengers Campus","Spider-Man W.E.B. Adventure"],["daw","attraction","Avengers Campus","Avengers Assemble: Flight Force"],["daw","attraction","Avengers Campus","Hero Training Center"],["daw","attraction","World of Frozen","Frozen Ever After"],
// Shows / entertainment
["dlp","show","Entertainment","Disney Stars on Parade"],["dlp","show","Entertainment","Disney Tales of Magic"],["dlp","show","Entertainment","The Lion King: Rhythms of the Pride Lands"],["dlp","show","Entertainment","Mickey and the Magician"],["dlp","show","Entertainment","Seasonal Halloween Entertainment"],
["daw","show","Entertainment","Disney Princess Cavalcade"],["daw","show","Entertainment","A Celebration in Arendelle"],["daw","show","Entertainment","TOGETHER: a Pixar Musical Adventure"],["daw","show","Entertainment","Marvel Avengers Campus Live Action Entertainment"],["daw","show","Entertainment","Disney Marching Band"],["daw","show","Entertainment","A Musical Moment with Rapunzel and Flynn"],["daw","show","Entertainment","Disney Cascade of Lights"],
// Character experiences
["dlp","character","Character Encounters","Meet Mickey Mouse"],["dlp","character","Character Encounters","Princess Pavilion"],["dlp","character","Character Encounters","Star Wars Character Encounter"],["dlp","character","Character Encounters","Classic Disney Character Encounters"],["dlp","character","Character Encounters","Meet Jack Skellington and Sally"],["dlp","character","Character Encounters","Meet Winnie the Pooh"],["dlp","character","Character Encounters","Meet Goofy"],
["daw","character","Character Encounters","Marvel Super Hero Encounters"],["daw","character","Character Encounters","Hero Training Center"],["daw","character","Character Encounters","Pixar Character Encounters"],["daw","character","Character Encounters","Woody / Toy Story Characters"],["daw","character","Character Encounters","Elsa & Anna — Rencontre Royale"]
].map((x,i)=>({id:`${x[0]}-${x[1]}-${i}`,park:x[0],category:x[1],land:x[2],name:x[3]}));
const CLOSED=["Crush's Coaster","La Galerie de la Belle au Bois Dormant","Mad Hatter's Tea Cups","Pirate Galleon","Pirates' Beach"]; // current official page status at build time; update if DLP changes
const ALIASES={"Avengers Assemble: Flight Force":["Flight Force"],"Spider-Man W.E.B. Adventure":["Spider-Man W.E.B. Adventure","Spider-Man W.E.B. Adventure*"],"The Twilight Zone Tower of Terror":["The Twilight Zone Tower of Terror™","Tower of Terror"],"Ratatouille : L’Aventure Totalement Toquée de Rémy":["Ratatouille: The Adventure"],"Star Wars Hyperspace Mountain":["Star Wars Hyperspace Mountain","Hyperspace Mountain"],"it's a small world":["\"it's a small world\""],"Slinky® Dog Zigzag Spin":["Slinky Dog Zigzag Spin"],"The Lion King: Rhythms of the Pride Lands":["The Lion King: Rhythms of the Pride Lands"]};
const STORE="dlp_map_checked_v5";let checked=JSON.parse(localStorage.getItem(STORE)||"{}");let waits={};let dataUpdated=null;let view="map";let zoom=1;let panX=0;let panY=0;let drag=null;
function norm(s){return String(s||"").toLowerCase().replace(/[™®’'“”\".:,!?–—-]/g," ").replace(/\s+/g," ").trim()}
function isDone(r){return !!checked[r.id]}
function save(){localStorage.setItem(STORE,JSON.stringify(checked))}
function toggle(r){checked[r.id]=!checked[r.id];save();renderAll();toast(isDone(r)?"Marked complete ✓":"Marked incomplete")}
function waitFor(r){const candidates=[r.name,...(ALIASES[r.name]||[])].map(norm);const key=Object.keys(waits).find(k=>candidates.some(c=>norm(k)===c||norm(k).includes(c)||c.includes(norm(k))));return key?waits[key]:null}
function status(r){if(r.category!=="attraction")return "event";if(CLOSED.includes(r.name))return "closed";const w=waitFor(r);if(!w)return "nodata";if(w.closed===true||w.is_open===false)return "closed";const n=Number(w.wait??w.wait_time);if(!Number.isFinite(n))return "nodata";return n<=20?"green":n<=45?"yellow":n<=70?"orange":"red"}
function waitText(r){if(r.category!=="attraction")return "EVENT";const s=status(r);if(s==="closed")return "CLOSED";const w=waitFor(r);if(!w)return "—";const n=Number(w.wait??w.wait_time);return Number.isFinite(n)?`${n}m`:"—"}
function filtered(){const p=document.getElementById("park").value,t=document.getElementById("type").value,s=document.getElementById("state").value,q=norm(document.getElementById("search").value);return CATALOG.filter(r=>(p==="all"||r.park===p)&&(t==="all"||r.category===t)&&(!q||norm(r.name).includes(q)||norm(r.land).includes(q)||norm(r.category).includes(q))).filter(r=>{if(s==="done")return isDone(r);if(s==="todo")return !isDone(r);if(s==="closed")return status(r)==="closed";if(s==="live")return ["green","yellow","orange","red"].includes(status(r));return true})}
const svg=document.getElementById("map");
const mapViewport=document.getElementById("mapViewport");
const mapStage=document.getElementById("mapStage");
const zoomLabel=document.getElementById("zoomLabel");

// Interactive marker zones are aligned to the original illustrated resort artwork.
// The artwork remains the visual map; the SVG layer supplies live status and completion controls.
const MAP_ZONES={
 "dlp|Main Street U.S.A.":{x:320,y:470,w:280,h:330},
 "dlp|Adventureland":{x:70,y:230,w:280,h:250},
 "dlp|Frontierland":{x:40,y:500,w:300,h:245},
 "dlp|Fantasyland":{x:220,y:95,w:340,h:340},
 "dlp|Discoveryland":{x:500,y:245,w:255,h:300},
 "daw|World Premiere Plaza":{x:780,y:120,w:330,h:250},
 "daw|Adventure Way":{x:650,y:590,w:330,h:250},
 "daw|Worlds of Pixar":{x:1230,y:390,w:270,h:330},
 "daw|Avengers Campus":{x:900,y:600,w:350,h:280},
 "daw|World of Frozen":{x:1180,y:75,w:310,h:285},
 "dlp|Entertainment":{x:335,y:355,w:180,h:130},
 "dlp|Character Encounters":{x:250,y:290,w:320,h:300},
 "daw|Entertainment":{x:780,y:340,w:390,h:260},
 "daw|Character Encounters":{x:900,y:330,w:450,h:360}
};

function landProgress(park,land){const rs=CATALOG.filter(r=>r.park===park&&r.land===land);const d=rs.filter(isDone).length;return [d,rs.length]}
function markerPos(r){
  const z=MAP_ZONES[`${r.park}|${r.land}`]||{x:50,y:50,w:100,h:100};
  const rs=CATALOG.filter(x=>x.park===r.park&&x.land===r.land);
  const i=rs.findIndex(x=>x.id===r.id);
  const cols=z.w>300?3:2, row=Math.floor(i/cols), col=i%cols;
  const rows=Math.max(1,Math.ceil(rs.length/cols));
  const px=z.x+30+(z.w-60)*(col/(Math.max(1,cols-1)));
  const py=z.y+38+(z.h-65)*(row/Math.max(1,rows-1));
  return [px,py];
}
function landChip(park,land){
  const z=MAP_ZONES[`${park}|${land}`]; if(!z)return '';
  const [d,total]=landProgress(park,land),pct=total?Math.round(d/total*100):0;
  return `<g class="land-chip" transform="translate(${z.x+8} ${z.y+8})"><rect width="${Math.min(150,z.w-16)}" height="27" rx="13"/><text x="11" y="18">${esc(land)}</text><text class="chip-count" x="${Math.min(142,z.w-24)}" y="18" text-anchor="end">${d}/${total}</text></g>`;
}
function renderMap(){
  let out='';
  LAND_ORDER.dlp.concat(LAND_ORDER.daw).forEach((land)=>{const p=LAND_ORDER.dlp.includes(land)?'dlp':'daw';out+=landChip(p,land)});
  filtered().forEach(r=>{
    const [x,y]=markerPos(r),s=status(r),done=isDone(r),wt=waitText(r);
    const cls=done?'done':s==='nodata'?'no-data':s==='closed'?'closed':s==='event'?'event':'live-'+s;
    const glyph=done?'✓':r.category==='show'?'S':r.category==='character'?'C':wt==='—'?'•':wt.replace('m','');
    out+=`<g class="marker ${cls}" data-id="${r.id}" transform="translate(${x} ${y})" tabindex="0" role="button" aria-label="${esc(r.name)} — ${esc(wt)}"><circle class="hit" r="25"/><rect class="box" x="-18" y="-18" width="36" height="36" rx="10"/><text class="glyph">${glyph}</text><circle class="check-ring" r="21"/></g>`;
  });
  svg.innerHTML=out;
  svg.querySelectorAll('.marker').forEach(g=>{g.addEventListener('click',()=>openDrawer(g.dataset.id));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDrawer(g.dataset.id)}})});
}
function short(s){const words=s.replace(/[™®]/g,'').split(' ');return words.length>3?words.slice(0,3).join(' ')+'…':s}
function esc(s){return String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\\':'&#92;'}[c]))}
function renderList(){const el=document.getElementById("list");el.innerHTML=filtered().map(r=>`<article class="list-card" data-id="${r.id}"><input class="cb" type="checkbox" ${isDone(r)?"checked":""}><div class="main"><div class="name">${esc(r.name)}</div><div class="sub">${PARK[r.park]} • ${esc(r.land)} • ${r.category}</div></div><span class="wait ${status(r)}">${waitText(r)}${r.category==="attraction"&&waitFor(r)?"<small>LIVE</small>":""}</span></article>`).join("")||"<div class='list-card'>Nothing matches.</div>";el.querySelectorAll(".list-card").forEach(c=>{const r=CATALOG.find(x=>x.id===c.dataset.id);c.querySelector(".cb").addEventListener("click",e=>{e.stopPropagation();toggle(r)});c.addEventListener("click",e=>{if(!e.target.classList.contains("cb"))openDrawer(r.id)})})}
function renderChecklist(){const el=document.getElementById("checklist"),rows=filtered(),done=CATALOG.filter(isDone).length;document.getElementById("summary").textContent=`${done} of ${CATALOG.length} experiences completed • ${CATALOG.length-done} remaining`;el.innerHTML=rows.map(r=>`<article class="check-card"><input class="cb" data-id="${r.id}" type="checkbox" ${isDone(r)?"checked":""}><div class="main"><div class="name">${esc(r.name)}</div><div class="sub">${PARK[r.park]} • ${esc(r.land)} • ${r.category}</div></div><span class="wait ${status(r)}">${waitText(r)}</span></article>`).join("");el.querySelectorAll(".cb").forEach(cb=>cb.addEventListener("change",()=>toggle(CATALOG.find(r=>r.id===cb.dataset.id))))}
function renderStats(){const all=CATALOG.length,done=CATALOG.filter(isDone).length,live=CATALOG.filter(r=>["green","yellow","orange","red"].includes(status(r))).length,closed=CATALOG.filter(r=>status(r)==="closed").length;document.getElementById("stats").innerHTML=[[all,"experiences"],[done,"completed"],[live,"live waits"],[closed,"currently closed"]].map(x=>`<div class="stat"><b>${x[0]}</b><small>${x[1]}</small></div>`).join("")}
function renderAll(){renderStats();if(view==="map")renderMap();if(view==="list")renderList();if(view==="checklist")renderChecklist();document.querySelectorAll(".tabs button").forEach(b=>b.classList.toggle("active",b.dataset.view===view));["map","list","checklist"].forEach(v=>document.getElementById(v+"View").classList.toggle("hidden",view!==v));applyMapTransform()}
function openDrawer(id){const r=CATALOG.find(x=>x.id===id);if(!r)return;const s=status(r);document.getElementById("drawerBody").innerHTML=`<h2>${esc(r.name)}</h2><div class="meta">${PARK[r.park]} • ${esc(r.land)} • ${r.category}</div><div class="big ${s}">${esc(waitText(r))}</div><button class="complete" id="drawerComplete">${isDone(r)?"✓ Completed — tap to undo":"Mark complete"}</button>`;document.getElementById("drawer").classList.remove("hidden");document.getElementById("drawerComplete").onclick=()=>{toggle(r);openDrawer(r.id)}}
document.getElementById("close").onclick=()=>document.getElementById("drawer").classList.add("hidden");
function toast(t){const x=document.getElementById("toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1200)}
function applyFilters(){renderAll()}
["park","type","state","search"].forEach(id=>document.getElementById(id).addEventListener(id==="search"?"input":"change",applyFilters));
document.querySelectorAll(".tabs button").forEach(b=>b.addEventListener("click",()=>{view=b.dataset.view;renderAll()}));
document.getElementById("reset").onclick=()=>{if(confirm("Reset all completed attractions and experiences on this device?")){checked={};save();renderAll()}};
document.getElementById("refresh").onclick=loadWaits;
async function loadWaits(){document.getElementById("updated").textContent="Refreshing…";try{const urls=["https://queue-times.com/parks/4/queue_times.json?ts="+Date.now(),"https://queue-times.com/parks/28/queue_times.json?ts="+Date.now()];const rs=await Promise.all(urls.map(u=>fetch(u,{cache:"no-store"})));if(rs.some(r=>!r.ok))throw new Error("Queue-Times request failed");const js=await Promise.all(rs.map(r=>r.json()));waits={};js.forEach(j=>(j.lands||[]).forEach(l=>(l.rides||[]).forEach(x=>{waits[x.name]={wait:x.wait_time,is_open:x.is_open,closed:x.is_open===false,last_updated:x.last_updated}})));dataUpdated=js.flatMap(j=>(j.lands||[]).flatMap(l=>(l.rides||[]).map(x=>x.last_updated).filter(Boolean))).sort().pop()||new Date().toISOString();document.getElementById("source").innerHTML='Wait source: <a href="https://queue-times.com/" target="_blank" rel="noopener">Queue-Times.com</a>';document.getElementById("updated").textContent="Updated "+new Date(dataUpdated).toLocaleTimeString([], {hour:"numeric",minute:"2-digit"});renderAll();document.getElementById("progress").style.animation="none";void document.getElementById("progress").offsetWidth;document.getElementById("progress").style.animation="shrink 300s linear forwards"}catch(e){document.getElementById("updated").textContent="Live wait feed unavailable";document.getElementById("source").innerHTML='Wait source: <a href="https://queue-times.com/" target="_blank" rel="noopener">Queue-Times.com</a> • checklist still works';renderAll()}}
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function applyMapTransform(){
  if(!mapStage||!mapViewport)return;
  const vw=mapViewport.clientWidth, vh=mapViewport.clientHeight;
  const sw=vw*zoom, sh=vw*(1024/1536)*zoom;
  const minX=Math.min(0,vw-sw), minY=Math.min(0,vh-sh);
  panX=clamp(panX,minX,0); panY=clamp(panY,minY,0);
  mapStage.style.transform=`translate3d(${panX}px,${panY}px,0) scale(${zoom})`;
  if(zoomLabel)zoomLabel.textContent=`${Math.round(zoom*100)}%`;
  const reset=document.getElementById("zoomReset"); if(reset)reset.textContent=`${Math.round(zoom*100)}%`;
}
function setZoom(next,cx=null,cy=null){
  if(!mapViewport)return;
  const old=zoom; zoom=clamp(next,1,3);
  if(cx!==null&&cy!==null&&old!==zoom){panX=cx-(cx-panX)*(zoom/old);panY=cy-(cy-panY)*(zoom/old)}
  applyMapTransform();
}
function focusMap(kind){
  const targets={resort:[768,512,1],dlp:[400,470,1.75],daw:[1120,470,1.75]};
  const [tx,ty,z]=targets[kind]||targets.resort;
  zoom=z;
  const vw=mapViewport.clientWidth,vh=mapViewport.clientHeight;
  panX=vw/2-(tx/1536*vw)*zoom; panY=vh/2-(ty/1024*(vw*1024/1536))*zoom;
  applyMapTransform();
  document.querySelectorAll(".map-focus").forEach(b=>b.classList.toggle("active",b.dataset.focus===kind));
}
document.getElementById("zoomIn").onclick=()=>setZoom(zoom+.25,mapViewport.clientWidth/2,mapViewport.clientHeight/2);
document.getElementById("zoomOut").onclick=()=>setZoom(zoom-.25,mapViewport.clientWidth/2,mapViewport.clientHeight/2);
document.getElementById("zoomReset").onclick=()=>focusMap("resort");
document.querySelectorAll(".map-focus").forEach(b=>b.addEventListener("click",()=>focusMap(b.dataset.focus)));
mapViewport.addEventListener("wheel",e=>{e.preventDefault();const r=mapViewport.getBoundingClientRect();setZoom(zoom+(e.deltaY<0?.2:-.2),e.clientX-r.left,e.clientY-r.top)},{passive:false});
mapViewport.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse"&&e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,px:panX,py:panY};mapViewport.setPointerCapture(e.pointerId)});
mapViewport.addEventListener("pointermove",e=>{if(!drag||drag.id!==e.pointerId)return;panX=drag.px+e.clientX-drag.x;panY=drag.py+e.clientY-drag.y;applyMapTransform()});
mapViewport.addEventListener("pointerup",e=>{if(drag?.id===e.pointerId)drag=null});
mapViewport.addEventListener("pointercancel",()=>drag=null);
window.addEventListener("resize",()=>applyMapTransform());
loadWaits();setInterval(loadWaits,300000);renderAll();
