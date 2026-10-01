const API = {
  dlp: "https://queue-times.com/parks/4/queue_times.json",
  daw: "https://queue-times.com/parks/28/queue_times.json"
};


// Master catalog: independent of live wait data so every experience remains visible.
const MASTER_CATALOG = [
  ["dlp","attraction","Main Street, U.S.A.","Main Street Vehicles"],["dlp","attraction","Main Street, U.S.A.","Disneyland Railroad"],["dlp","attraction","Main Street, U.S.A.","Horse-Drawn Streetcars"],["dlp","attraction","Main Street, U.S.A.","Discovery Arcade"],["dlp","attraction","Main Street, U.S.A.","Liberty Arcade"],
  ["dlp","attraction","Adventureland","Pirates of the Caribbean"],["dlp","attraction","Adventureland","Indiana Jones™ and the Temple of Peril"],["dlp","attraction","Adventureland","Adventure Isle"],["dlp","attraction","Adventureland","La Cabane des Robinson"],["dlp","attraction","Adventureland","Le Passage Enchanté d'Aladdin"],
  ["dlp","attraction","Frontierland","Big Thunder Mountain"],["dlp","attraction","Frontierland","Phantom Manor"],["dlp","attraction","Frontierland","Thunder Mesa Riverboat Landing"],["dlp","attraction","Frontierland","Rustler Roundup Shootin' Gallery"],
  ["dlp","attraction","Fantasyland","Peter Pan's Flight"],["dlp","attraction","Fantasyland","it's a small world"],["dlp","attraction","Fantasyland","Dumbo the Flying Elephant"],["dlp","attraction","Fantasyland","Mad Hatter's Tea Cups"],["dlp","attraction","Fantasyland","Alice's Curious Labyrinth"],["dlp","attraction","Fantasyland","Casey Jr. – le Petit Train du Cirque"],["dlp","attraction","Fantasyland","Le Pays des Contes de Fées"],["dlp","attraction","Fantasyland","Le Carrousel de Lancelot"],["dlp","attraction","Fantasyland","Princess Pavilion"],["dlp","attraction","Fantasyland","Mickey's PhilharMagic"],
  ["dlp","attraction","Discoveryland","Star Wars Hyperspace Mountain"],["dlp","attraction","Discoveryland","Buzz Lightyear Laser Blast"],["dlp","attraction","Discoveryland","Star Tours: The Adventures Continue"],["dlp","attraction","Discoveryland","Orbitron®"],["dlp","attraction","Discoveryland","Autopia, presented by Avis"],["dlp","attraction","Discoveryland","Les Mystères du Nautilus"],
  ["daw","attraction","Adventure Way","Raiponce Tangled Spin"],["daw","attraction","Worlds of Pixar","Ratatouille : L’Aventure Totalement Toquée de Rémy"],["daw","attraction","Worlds of Pixar","Crush's Coaster"],["daw","attraction","Worlds of Pixar","Cars ROAD TRIP"],["daw","attraction","Worlds of Pixar","Cars Quatre Roues Rallye"],["daw","attraction","Toy Story Playland","RC Racer"],["daw","attraction","Toy Story Playland","Slinky Dog Zigzag Spin"],["daw","attraction","Toy Story Playland","Toy Soldiers Parachute Drop"],["daw","attraction","Avengers Campus","Spider-Man W.E.B. Adventure"],["daw","attraction","Avengers Campus","Avengers Assemble: Flight Force"],["daw","attraction","Avengers Campus","Hero Training Center"],["daw","attraction","World of Frozen","Frozen Ever After"],["daw","attraction","Front Lot","The Twilight Zone Tower of Terror™"],
  ["dlp","show","Entertainment","Disney Stars on Parade"],["dlp","show","Entertainment","Disney Tales of Magic"],["dlp","show","Entertainment","The Lion King: Rhythms of the Pride Lands"],["dlp","show","Entertainment","Seasonal Halloween entertainment"],["daw","show","Entertainment","Disney Cascade of Lights"],["daw","show","Entertainment","Disney Princess Cavalcade"],["daw","show","Entertainment","Mickey and the Magician"],["daw","show","Entertainment","TOGETHER: A Pixar Musical Adventure"],["daw","show","Entertainment","A Celebration in Arendelle"],["daw","show","Entertainment","Marvel Avengers Campus Live Action Entertainment"],
  ["dlp","character","Character Encounters","Meet Mickey Mouse"],["dlp","character","Character Encounters","Disney Princess Characters — Princess Pavilion"],["dlp","character","Character Encounters","Star Wars Characters"],["dlp","character","Character Encounters","Classic Disney Characters"],["dlp","character","Character Encounters","Meet Jack Skellington and Sally"],["dlp","character","Character Encounters","Meet Goofy"],["dlp","character","Character Encounters","Meet Winnie the Pooh"],["daw","character","Character Encounters","Marvel Super Heroes"],["daw","character","Character Encounters","Pixar Characters"],["daw","character","Character Encounters","Toy Story Characters"],["daw","character","Character Encounters","Elsa & Anna — Rencontre Royale"]
];
const CATALOG_ALIASES={
  "it's a small world":["\"it's a small world\""],"The Twilight Zone Tower of Terror™":["The Twilight Zone Tower of Terror","Tower of Terror"],"Ratatouille : L’Aventure Totalement Toquée de Rémy":["Ratatouille: The Adventure"],"Avengers Assemble: Flight Force":["Flight Force"],"Star Wars Hyperspace Mountain":["Hyperspace Mountain"],"Star Tours: The Adventures Continue":["Star Tours"]
};
function normName(s){return String(s||"").toLowerCase().replace(/[™®’'“”".:,!?–—-]/g," ").replace(/\s+/g," ").trim()}
function findLiveFor(name,rows){const targets=[name,...(CATALOG_ALIASES[name]||[])].map(normName);return rows.find(r=>targets.some(t=>normName(r.name)===t||normName(r.name).includes(t)||t.includes(normName(r.name))))||null}
function buildMaster(rows){const master=MASTER_CATALOG.map(([park,category,land,name],i)=>{const live=findLiveFor(name,rows);return {id:`catalog-${park}-${i}`,key:key(park,`catalog-${i}`,name),park,category,land,name,is_open:live?!!live.is_open:null,wait_time:live?Number(live.wait_time||0):null,fallback:!live,noLiveData:!live}});const known=new Set(master.map(r=>normName(r.name)));rows.forEach(r=>{if(!known.has(normName(r.name)))master.push({...r,category:"attraction",noLiveData:false})});return master}

const PARKS = {
  dlp: { name:"Disneyland Park", center:[48.8728,2.7752] },
  daw: { name:"Disney Adventure World", center:[48.8680,2.7770] }
};

// Approximate attraction locations. Live status/wait comes from Queue-Times;
// missing coordinates fall back to the land center so every attraction remains mappable.
const COORDS = {
  "Big Thunder Mountain":[48.87130,2.77453],
  "Indiana Jones™ and the Temple of Peril":[48.87245,2.77220],
  "Pirates of the Caribbean":[48.87185,2.77295],
  "Peter Pan's Flight":[48.87335,2.77585],
  "Buzz Lightyear Laser Blast":[48.87405,2.77810],
  "Star Wars Hyperspace Mountain":[48.87375,2.77855],
  "Autopia, presented by Avis":[48.87320,2.77893],
  "Orbitron®":[48.87360,2.77838],
  "Dumbo the Flying Elephant":[48.87345,2.77675],
  "Phantom Manor":[48.87105,2.77370],
  "It's a Small World":[48.87510,2.77510],
  "\"it's a small world\"":[48.87510,2.77510],
  "Les Mystères du Nautilus":[48.87435,2.77910],
  "Star Tours: The Adventures Continue*":[48.87435,2.77900],
  "Ratatouille : L’Aventure Totalement Toquée de Rémy":[48.86770,2.77585],
  "Ratatouille: The Adventure":[48.86770,2.77585],
  "Spider-Man W.E.B. Adventure":[48.86830,2.77845],
  "Avengers Assemble: Flight Force":[48.86815,2.77915],
  "The Twilight Zone Tower of Terror":[48.86855,2.77680],
  "Tower of Terror":[48.86855,2.77680],
  "RC Racer":[48.86785,2.77475],
  "Slinky Dog Zigzag Spin":[48.86755,2.77430],
  "Toy Soldiers Parachute Drop":[48.86715,2.77405],
  "Cars ROAD TRIP":[48.86590,2.77560],
  "Crush's Coaster":[48.86830,2.77761],
  "Cars Quatre Roues Rallye":[48.86800,2.77530],
  "Frozen Ever After":[48.86935,2.78110]
};

const LAND_FALLBACK = {
  "Adventureland":[48.87235,2.77255],
  "Discoveryland":[48.87400,2.77845],
  "Fantasyland":[48.87400,2.77570],
  "Frontierland":[48.87100,2.77410],
  "Main Street, U.S.A.":[48.87290,2.77660],
  "Worlds of Pixar":[48.86760,2.77510],
  "Avengers Campus":[48.86820,2.77865],
  "Front Lot":[48.86900,2.77700],
  "Toy Story Playland":[48.86740,2.77435],
  "World of Frozen":[48.86940,2.78110]
};

const FALLBACK = {
  dlp: [
    ["Big Thunder Mountain","Frontierland"],["Indiana Jones™ and the Temple of Peril","Adventureland"],
    ["Pirates of the Caribbean","Adventureland"],["Peter Pan's Flight","Fantasyland"],
    ["Buzz Lightyear Laser Blast","Discoveryland"],["Star Wars Hyperspace Mountain","Discoveryland"],
    ["Autopia, presented by Avis","Discoveryland"],["Orbitron®","Discoveryland"],
    ["Dumbo the Flying Elephant","Fantasyland"],["Phantom Manor","Frontierland"],
    ["\"it's a small world\"","Fantasyland"],["Les Mystères du Nautilus","Discoveryland"],
    ["Star Tours: The Adventures Continue*","Discoveryland"],["Le Carrousel de Lancelot","Fantasyland"],
    ["Casey Jr. – le Petit Train du Cirque","Fantasyland"],["Le Pays des Contes de Fées, presented by Vittel","Fantasyland"],
    ["Mad Hatter's Tea Cups","Fantasyland"],["La Cabane des Robinson","Adventureland"],
    ["Alice's Curious Labyrinth","Fantasyland"],["Main Street Vehicles","Main Street, U.S.A."]
  ],
  daw: [
    ["Ratatouille : L’Aventure Totalement Toquée de Rémy","Worlds of Pixar"],
    ["Spider-Man W.E.B. Adventure","Avengers Campus"],["Avengers Assemble: Flight Force","Avengers Campus"],
    ["The Twilight Zone Tower of Terror","Front Lot"],["RC Racer","Toy Story Playland"],
    ["Slinky Dog Zigzag Spin","Toy Story Playland"],["Toy Soldiers Parachute Drop","Toy Story Playland"],
    ["Cars ROAD TRIP","Worlds of Pixar"],["Crush's Coaster","Worlds of Pixar"],
    ["Cars Quatre Roues Rallye","Worlds of Pixar"],["Frozen Ever After","World of Frozen"]
  ]
};

let rides = [];
let activeDay = localStorage.getItem("dlp_active_day") || "trip";
let checkedByDay = JSON.parse(localStorage.getItem("dlp_checked_by_day_v1") || "{}");
function dayStore(){ if(!checkedByDay[activeDay]) checkedByDay[activeDay]={}; return checkedByDay[activeDay]; }
function save(){ localStorage.setItem("dlp_checked_by_day_v1", JSON.stringify(checkedByDay)); localStorage.setItem("dlp_active_day", activeDay); }
function isDone(r){
  if(activeDay === "trip") return Object.values(checkedByDay).some(day=>!!day[r.key]);
  return !!dayStore()[r.key];
}
let map;
let markers = new Map();
let currentView = "map";

function key(park,id,name){ return `${park}:${id || name}`; }
function coordFor(r){
  if(COORDS[r.name]) return COORDS[r.name];
  if(LAND_FALLBACK[r.land]) return LAND_FALLBACK[r.land];
  return PARKS[r.park].center;
}
function waitClass(r){
  if(r.category!=="attraction" || r.noLiveData) return "closed";
  if(!r.is_open) return "closed";
  if(r.wait_time <= 20) return "green";
  if(r.wait_time <= 45) return "yellow";
  if(r.wait_time <= 70) return "orange";
  return "red";
}

function toast(msg){
  const el=document.getElementById("toast"); el.textContent=msg; el.classList.add("show");
  clearTimeout(window.__toast); window.__toast=setTimeout(()=>el.classList.remove("show"),1800);
}

async function fetchPark(park){
  try{
    const res=await fetch(API[park], {cache:"no-store"});
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data=await res.json();
    const out=[];
    (data.lands || []).forEach(land => (land.rides || []).forEach(r => out.push({
      ...r, park, land:land.name, key:key(park,r.id,r.name)
    })));
    (data.rides || []).forEach(r => out.push({...r, park, land:"Other", key:key(park,r.id,r.name)}));
    return out;
  }catch(e){
    return FALLBACK[park].map(([name,land],i)=>({
      id:`fallback-${park}-${i}`, name, land, park, key:key(park,`fallback-${i}`,name),
      is_open:false, wait_time:0, fallback:true
    }));
  }
}

async function refresh(){
  const btn=document.getElementById("refreshBtn"); btn.disabled=true; btn.textContent="…";
  document.getElementById("dataStatus").textContent="Refreshing live wait times…";
  const [a,b]=await Promise.all([fetchPark("dlp"),fetchPark("daw")]);
  const liveRows=[...a,...b];
  rides=buildMaster(liveRows);
  render();
  const live=rides.some(r=>!r.fallback);
  document.getElementById("lastUpdated").textContent=`Updated ${new Date().toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})}`;
  document.getElementById("dataStatus").textContent=live ? "Live Queue-Times data • refreshes about every 5 minutes" : "Live feed unavailable • showing fallback attraction list";
  const bar=document.getElementById("progressBar"); bar.style.animation="none"; void bar.offsetWidth; bar.style.animation="shrink 300s linear forwards";
  btn.disabled=false; btn.textContent="↻";
}

function filtered(){
  const park=document.getElementById("parkFilter").value;
  const status=document.getElementById("statusFilter").value;
  const category=document.getElementById("categoryFilter").value;
  const q=document.getElementById("search").value.trim().toLowerCase();
  return rides.filter(r=>{
    const category=document.getElementById("categoryFilter").value;
    if(park!=="all" && r.park!==park) return false;
    if(category!=="all" && r.category!==category) return false;
    if(status==="open" && (r.category!=="attraction" || !r.is_open)) return false;
    if(status==="closed" && (r.category!=="attraction" || r.is_open!==false)) return false;
    if(status==="done" && !isDone(r)) return false;
    if(status==="todo" && isDone(r)) return false;
    if(category!=="all" && r.category!==category) return false;
    return !q || `${r.name} ${r.land} ${PARKS[r.park].name}`.toLowerCase().includes(q);
  }).sort((a,b)=>a.name.localeCompare(b.name));
}

function renderStats(){
  const total=rides.length, done=rides.filter(isDone).length, open=rides.filter(r=>r.category==="attraction" && r.is_open).length;
  const waits=rides.filter(r=>r.category==="attraction" && r.is_open && !r.noLiveData).map(r=>r.wait_time);
  const avg=waits.length ? Math.round(waits.reduce((a,b)=>a+b,0)/waits.length) : 0;
  document.getElementById("dashboard").innerHTML=`
    <div class="stat"><div class="value">${done}/${total}</div><div class="label">Completed ${activeDay!=="trip"?"today":"this trip"}</div></div>
    <div class="stat"><div class="value">${open}</div><div class="label">Open now</div></div>
    <div class="stat"><div class="value">${avg} min</div><div class="label">Average wait</div></div>
    <div class="stat"><div class="value">${rides.filter(r=>r.park==="dlp").length} / ${rides.filter(r=>r.park==="daw").length}</div><div class="label">DLP / DAW</div></div>`;
}

function renderList(){
  const el=document.getElementById("rideList");
  const rows=filtered();
  el.innerHTML=rows.map(r=>`
    <article class="ride-card" data-key="${escapeHtml(r.key)}">
      <input class="checkbox" type="checkbox" ${isDone(r)?"checked":""} aria-label="Completed">
      <div class="ride-main">
        <div class="ride-name">${escapeHtml(r.name)}</div>
        <div class="ride-land">${escapeHtml(r.land)} · ${PARKS[r.park].name} · ${r.category}</div>
      </div>
      <span class="park-badge">${r.park==="dlp"?"DLP":"DAW"}</span>
      <div class="wait ${waitClass(r)}">${r.category!=="attraction" ? "EVENT" : (r.noLiveData ? "—<small>NO LIVE DATA</small>" : (r.is_open ? `${r.wait_time}<small>MIN</small>` : "CLOSED"))}</div>
    </article>`).join("") || `<div class="ride-card">No attractions match your filters.</div>`;
  el.querySelectorAll(".ride-card").forEach(card=>{
    const r=rides.find(x=>x.key===card.dataset.key);
    card.querySelector(".checkbox").addEventListener("click",e=>{e.stopPropagation(); toggle(r)});
    card.addEventListener("click",()=>focusRide(r));
  });
}

function renderChecklist(){
  const el=document.getElementById("checklist");
  const rows=filtered();
  const done=rides.filter(isDone).length;
  document.getElementById("checklistSummary").textContent=`${done} of ${rides.length} completed • ${rides.length-done} remaining${activeDay!=="trip"?` • ${activeDay}`:""}`;
  document.getElementById("checklistTitle").textContent=activeDay==="trip" ? "Your trip checklist" : `Checklist — ${new Date(activeDay+"T12:00:00").toLocaleDateString([], {weekday:"short",month:"short",day:"numeric"})}`;
  el.innerHTML=rows.map(r=>`
    <article class="check-item ${isDone(r)?"done":""}">
      <input class="checkbox" type="checkbox" ${isDone(r)?"checked":""} aria-label="Completed">
      <div class="ride-main"><div class="ride-name">${escapeHtml(r.name)}</div><div class="ride-land">${escapeHtml(r.land)} · ${PARKS[r.park].name} · ${r.category}</div></div>
      <div class="wait ${waitClass(r)}">${r.category!=="attraction" ? "EVENT" : (r.noLiveData ? "—<small>NO LIVE DATA</small>" : (r.is_open ? `${r.wait_time}<small>MIN</small>` : "CLOSED"))}</div>
    </article>`).join("") || `<div class="ride-card">No attractions match your filters.</div>`;
  el.querySelectorAll(".check-item").forEach(item=>{
    const name=item.querySelector(".ride-name").textContent;
    const r=rides.find(x=>x.name===name);
    item.querySelector(".checkbox").addEventListener("change",()=>toggle(r));
  });
}

function renderMap(){
  if(!map){
    map=L.map("map",{zoomControl:true}).setView(PARKS.dlp.center,16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:20,attribution:'© OpenStreetMap contributors'}).addTo(map);
  }
  markers.forEach(m=>m.remove()); markers.clear();
  filtered().forEach(r=>{
    const [lat,lng]=coordFor(r), cls=waitClass(r);
    const color={green:"#16a34a",yellow:"#eab308",orange:"#f97316",red:"#dc2626",closed:"#64748b"}[cls];
    const icon=L.divIcon({
      className:"custom-pin",
      html:`<div style="background:${color};width:34px;height:34px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px #0004;display:grid;place-items:center;color:white;font-weight:900;font-size:10px">${r.category!=="attraction"?"★":(r.noLiveData?"—":(r.is_open?r.wait_time:"×"))}</div>`,
      iconSize:[34,34],iconAnchor:[17,17]
    });
    const marker=L.marker([lat,lng],{icon}).addTo(map);
    marker.bindPopup(`<div class="popup-title">${escapeHtml(r.name)}</div><div>${escapeHtml(PARKS[r.park].name)} · ${escapeHtml(r.land)}</div><div class="popup-wait">${r.category!=="attraction" ? r.category.toUpperCase() : (r.noLiveData ? "No live wait data" : (r.is_open ? `${r.wait_time} min` : "Closed"))}</div><button class="popup-btn" onclick="window.__toggleFromMap('${encodeURIComponent(r.key)}')">${isDone(r)?"✓ Completed":"Mark complete"}</button>`);
    markers.set(r.key,marker);
  });
  // Fit to whichever park is selected.
  const park=document.getElementById("parkFilter").value;
  if(park!=="all") map.setView(PARKS[park].center,16.7);
  else map.setView([48.8705,2.7768],16.2);
}

window.__toggleFromMap=function(encoded){
  const r=rides.find(x=>x.key===decodeURIComponent(encoded)); if(r) toggle(r);
};

function toggle(r){
  if(!r) return;
  if(activeDay === "trip") {
    const next = !isDone(r);
    checkedByDay["trip"] = checkedByDay["trip"] || {};
    checkedByDay["trip"][r.key]=next;
  } else {
    dayStore()[r.key]=!dayStore()[r.key];
  }
  save(); render();
  toast(isDone(r) ? `${r.name} completed ✓` : `${r.name} unchecked`);
}

function focusRide(r){
  document.querySelector('[data-view="map"]').click();
  setTimeout(()=>{
    const m=markers.get(r.key); if(m){ map.setView(m.getLatLng(),17); m.openPopup(); }
  },50);
}

function render(){
  renderStats(); renderList(); renderChecklist(); renderMap();
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
}

document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active")); btn.classList.add("active");
  currentView=btn.dataset.view;
  document.getElementById("mapView").classList.toggle("hidden",currentView!=="map");
  document.getElementById("listView").classList.toggle("hidden",currentView!=="list");
  document.getElementById("checklistView").classList.toggle("hidden",currentView!=="checklist");
  document.getElementById("planView").classList.toggle("hidden",currentView!=="plan");
  if(currentView==="map") setTimeout(()=>map && map.invalidateSize(),50);
}));

["parkFilter","categoryFilter","statusFilter","search"].forEach(id=>document.getElementById(id).addEventListener("input",render));
document.getElementById("refreshBtn").addEventListener("click",refresh);
document.getElementById("resetBtn").addEventListener("click",()=>{
  if(confirm(`Reset completed items for ${activeDay === "trip" ? "the whole trip" : activeDay}?`)){
    if(activeDay === "trip") checkedByDay={}; else checkedByDay[activeDay]={};
    save(); render(); toast("Checklist reset");
  }
});

refresh();
setInterval(refresh,300000);
