// ===== PUBLICATIONS DATA =====
const publications = [
  { id:1, title:"GROKE: A Vision-Free Navigation Instruction Evaluation Framework", venue:"ACL ARR 2026", year:2026, status:"review", tags:["navigation","evaluation"], colors:{bg:'#2a5a2a',building:'#3a7a3a',accent:'#88cc88'} },
  { id:2, title:"GenomAgent: Multi-Agent Framework for Genomic Question Answering", venue:"ACL ARR 2026", year:2026, status:"review", tags:["agents"], colors:{bg:'#2a2a5a',building:'#3a3a7a',accent:'#8888cc'} },
  { id:3, title:"Knowledge Graph Validation with LLM-Based Approaches", venue:"EDBT'26", year:2026, status:"accepted", tags:["kg"], colors:{bg:'#5a2a2a',building:'#7a3a3a',accent:'#cc8888'} },
  { id:4, title:"Graph-to-Text Generation for Spatial Data Representation", venue:"ECIR 2026", year:2026, status:"accepted", tags:["navigation","kg"], colors:{bg:'#5a5a2a',building:'#7a7a3a',accent:'#cccc88'} },
  { id:5, title:"Contrastive Learning for Navigation Embedding Models", venue:"In Progress", year:2025, status:"preprint", tags:["navigation","evaluation"], colors:{bg:'#3a3a3a',building:'#555',accent:'#999'} },
  { id:6, title:null, venue:null, year:null, status:"coming", tags:[], colors:{} }
];

// ===== PIXEL ART UTILITIES =====
function drawRect(ctx,x,y,w,h,color,s=1){ctx.fillStyle=color;ctx.fillRect(x*s,y*s,w*s,h*s);}
function drawPixel(ctx,x,y,color,s=2){ctx.fillStyle=color;ctx.fillRect(x*s,y*s,s,s);}

// ===== PUB CARD ART =====
function drawPubCardArt(canvas, pub) {
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const w = canvas.width, h = canvas.height;

  if (pub.status === 'coming') {
    ctx.fillStyle = '#f0ead8'; ctx.fillRect(0,0,w,h);
    ctx.strokeStyle = '#ddd'; ctx.lineWidth = 0.5;
    for (let i=0;i<h;i+=12){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(w,i);ctx.stroke();}
    ctx.strokeStyle = '#999'; ctx.lineWidth = 1.5; ctx.setLineDash([4,3]);
    ctx.strokeRect(30,40,40,60); ctx.strokeRect(80,30,50,70); ctx.strokeRect(50,55,30,45);
    ctx.setLineDash([]); ctx.fillStyle = '#aaa';
    ctx.font = 'italic 18px "Silkscreen", monospace'; ctx.fillText('?', 95, 65);
    ctx.beginPath(); ctx.arc(140,50,12,0,Math.PI*2); ctx.stroke();
    return;
  }

  const {bg, building: bld, accent: acc} = pub.colors;
  ctx.fillStyle = bg; ctx.fillRect(0,0,w,h);

  // Stars
  for(let i=0;i<15;i++){
    ctx.fillStyle = acc+'44';
    const sx=Math.sin(pub.id*100+i*73)*w/2+w/2, sy=Math.sin(pub.id*200+i*47)*h/3+h/4;
    ctx.fillRect(sx,sy,2,2);
  }

  // Ground
  ctx.fillStyle = bld+'88'; ctx.fillRect(0,h*0.7,w,h*0.3);

  // Buildings
  const seed = pub.id;
  for(let b=0;b<2+(seed%3);b++){
    const bx=15+b*(w/(2+(seed%3))), bw=30+(seed*(b+1)*7)%40, bh=40+(seed*(b+1)*13)%50, by=h*0.7-bh;
    ctx.fillStyle=bld; ctx.fillRect(bx,by,bw,bh);
    ctx.fillStyle=acc+'66';
    ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+10,by-8);ctx.lineTo(bx+bw+10,by-8);ctx.lineTo(bx+bw,by);ctx.fill();
    ctx.fillStyle=bld+'aa'; ctx.fillRect(bx+bw,by,10,bh);
    const rows=Math.floor(bh/16), cols=Math.floor(bw/14);
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
      ctx.fillStyle=((seed+r+c)%3)?acc:bld+'cc';
      ctx.fillRect(bx+4+c*14,by+6+r*16,8,10);
    }
  }

  // Road
  ctx.fillStyle='#333'; ctx.fillRect(0,h-14,w,14);
  ctx.fillStyle='#aa8'; for(let i=0;i<w;i+=20)ctx.fillRect(i+4,h-8,10,2);
}

// ===== RENDER PUB CARDS =====
function renderPubCards(filter='all'){
  const grid=document.getElementById('pubGrid'); grid.innerHTML='';
  const filtered = filter==='all' ? publications : publications.filter(p=>p.tags.includes(filter)||p.status==='coming');
  filtered.forEach(pub=>{
    const card=document.createElement('div');
    card.className='pub-card'+(pub.status==='coming'?' coming-soon':'');
    if(pub.status==='coming'){
      card.innerHTML=`<div class="pub-card-preview"><canvas width="260" height="120"></canvas><div class="coming-soon-text">coming next ?</div></div><div class="pub-card-info"><div class="pub-card-title" style="color:#888;font-style:italic;">Work in progress...</div><div class="pub-card-footer"><span class="pub-card-year">2025+</span><button class="pub-card-btn" disabled style="opacity:0.4">TBD</button></div></div>`;
    } else {
      const bc=pub.status==='accepted'?'accepted':pub.status==='review'?'review':'preprint';
      const bt=pub.status==='accepted'?'ACCEPTED':pub.status==='review'?'UNDER REVIEW':'IN PROGRESS';
      card.innerHTML=`<div class="pub-card-preview"><canvas width="260" height="120"></canvas><div class="pub-card-badge ${bc}">${bt}</div></div><div class="pub-card-info"><div class="pub-card-title">${pub.title}</div><div class="pub-card-venue">${pub.venue}</div><div class="pub-card-footer"><span class="pub-card-year">${pub.year}</span><button class="pub-card-btn" onclick="event.stopPropagation()">READ</button></div></div>`;
    }
    grid.appendChild(card);
    const canvas=card.querySelector('canvas');
    requestAnimationFrame(()=>drawPubCardArt(canvas,pub));
  });
}

function filterPubs(tag,btn){
  document.querySelectorAll('.pub-filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderPubCards(tag);
}

function sortPubs(mode,btn){
  document.querySelectorAll('.pub-grid-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  if(mode==='venue') publications.sort((a,b)=>(a.venue||'ZZZ').localeCompare(b.venue||'ZZZ'));
  else publications.sort((a,b)=>(b.year||0)-(a.year||0));
  renderPubCards();
}

// ===== NAVIGATION =====
function navigateTo(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(a=>a.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  document.querySelector(`.nav-link[data-page="${page}"]`).classList.add('active');
  window.location.hash=page;
  const bubbles={about:'in pixel<br>we trust',publications:'read my<br>papers!',resume:'hire me<br>maybe?',contact:'say<br>hello!'};
  document.getElementById('speechBubble').innerHTML=bubbles[page]||'in pixel<br>we trust';
  if(page==='publications') renderPubCards();
  if(page==='contact') setTimeout(drawContactArt,50);
}

window.addEventListener('hashchange',()=>navigateTo(window.location.hash.replace('#','')||'about'));
document.querySelectorAll('.nav-link').forEach(link=>{
  link.addEventListener('click',e=>{e.preventDefault();navigateTo(link.dataset.page);});
});

// ===== PIXEL ART DRAWING =====
function drawMainCharacter(){
  const c=document.getElementById('mainCharacter'),ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;const s=2;
  drawRect(ctx,6,0,5,2,'#5a3a1a',s);drawRect(ctx,5,2,7,5,'#d4a574',s);
  drawPixel(ctx,7,4,'#222',s);drawPixel(ctx,10,4,'#222',s);drawRect(ctx,8,6,2,1,'#a06040',s);
  drawRect(ctx,5,7,7,8,'#6a5a4a',s);drawRect(ctx,8,7,1,6,'#c0392b',s);
  drawRect(ctx,3,8,2,6,'#6a5a4a',s);drawRect(ctx,12,8,2,6,'#6a5a4a',s);
  drawRect(ctx,3,14,2,1,'#d4a574',s);drawRect(ctx,12,14,2,1,'#d4a574',s);
  drawRect(ctx,5,15,3,5,'#333',s);drawRect(ctx,9,15,3,5,'#333',s);
  drawRect(ctx,4,20,4,2,'#222',s);drawRect(ctx,9,20,4,2,'#222',s);
}

function drawServerIcon(){
  const c=document.getElementById('serverIcon'),ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;const s=2;
  drawRect(ctx,5,2,10,20,'#ccc',s);drawRect(ctx,6,3,8,4,'#999',s);drawRect(ctx,6,8,8,4,'#999',s);drawRect(ctx,6,13,8,4,'#999',s);
  drawRect(ctx,15,2,5,20,'#aaa',s);drawPixel(ctx,13,5,'#0f0',s);drawPixel(ctx,13,10,'#0f0',s);drawPixel(ctx,13,15,'#f00',s);
  for(let i=0;i<3;i++)drawRect(ctx,7,4+i*5,5,1,'#777',s);
}

function drawAvatar(){
  const c=document.getElementById('avatarCanvas'),ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
  ctx.fillStyle='#8b6050';ctx.fillRect(0,0,50,42);
  ctx.fillStyle='#3a2010';ctx.fillRect(8,2,34,12);ctx.fillStyle='#d4a574';ctx.fillRect(12,8,26,24);
  ctx.fillStyle='#333';ctx.fillRect(14,16,10,6);ctx.fillRect(26,16,10,6);ctx.fillRect(24,18,2,2);
  ctx.fillStyle='#6688aa';ctx.fillRect(16,18,6,3);ctx.fillRect(28,18,6,3);
  ctx.fillStyle='#c09060';ctx.fillRect(23,22,4,4);ctx.fillStyle='#a06040';ctx.fillRect(20,28,10,2);
  ctx.fillStyle='#d4a574';ctx.fillRect(8,16,4,8);ctx.fillRect(38,16,4,8);
}

function init3DBuilding(){
  var container = document.getElementById('buildingCanvas');
  if (!container || typeof THREE === 'undefined') return;

  var width = container.clientWidth || 260;
  var height = container.clientHeight || 300;

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xb8cfe0, 0.004);

  var camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 500);

  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.setClearColor(0xb8cfe0);
  container.appendChild(renderer.domElement);

  // Materials
  var M = {
    brick: new THREE.MeshStandardMaterial({ color: 0xa04028, roughness: 0.88, metalness: 0.02 }),
    brickDark: new THREE.MeshStandardMaterial({ color: 0x7a3020, roughness: 0.9, metalness: 0.02 }),
    brickLight: new THREE.MeshStandardMaterial({ color: 0xb85838, roughness: 0.85, metalness: 0.02 }),
    white: new THREE.MeshStandardMaterial({ color: 0xe8e4dd, roughness: 0.7, metalness: 0.02 }),
    whiteTrim: new THREE.MeshStandardMaterial({ color: 0xf0ece5, roughness: 0.6, metalness: 0.05 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x556677, roughness: 0.08, metalness: 0.15,
      transmission: 0.3, transparent: true, opacity: 0.75,
      clearcoat: 0.8
    }),
    glassReflect: new THREE.MeshPhysicalMaterial({
      color: 0x8899aa, roughness: 0.05, metalness: 0.2,
      transmission: 0.15, transparent: true, opacity: 0.85,
      clearcoat: 1.0
    }),
    windowFrame: new THREE.MeshStandardMaterial({ color: 0x2a2520, roughness: 0.5, metalness: 0.3 }),
    concrete: new THREE.MeshStandardMaterial({ color: 0x999590, roughness: 0.85, metalness: 0.02 }),
    asphalt: new THREE.MeshStandardMaterial({ color: 0x555560, roughness: 0.95, metalness: 0.0 }),
    asphaltLight: new THREE.MeshStandardMaterial({ color: 0x6a6a70, roughness: 0.9, metalness: 0.0 }),
    grass: new THREE.MeshStandardMaterial({ color: 0x4a8a3a, roughness: 0.9, metalness: 0.0 }),
    grassLight: new THREE.MeshStandardMaterial({ color: 0x5a9a48, roughness: 0.85, metalness: 0.0 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x888899, roughness: 0.35, metalness: 0.7 }),
    metalWhite: new THREE.MeshStandardMaterial({ color: 0xddddee, roughness: 0.3, metalness: 0.5 }),
    roofDark: new THREE.MeshStandardMaterial({ color: 0x444448, roughness: 0.8, metalness: 0.1 }),
    flagBlue: new THREE.MeshStandardMaterial({ color: 0x2255aa, roughness: 0.6, metalness: 0.0, side: THREE.DoubleSide }),
    flagYellow: new THREE.MeshStandardMaterial({ color: 0xddcc22, roughness: 0.6, metalness: 0.0, side: THREE.DoubleSide }),
    signBlue: new THREE.MeshStandardMaterial({ color: 0x2244aa, roughness: 0.4, metalness: 0.1 }),
    stripe: new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.7, metalness: 0.0 })
  };

  var bldg = new THREE.Group();
  var flagMeshes = [];

  // Right wing (3 floors, main long section)
  function createRightWing() {
    var g = new THREE.Group();
    var body = new THREE.Mesh(new THREE.BoxGeometry(32, 10, 16), M.brick);
    body.position.set(8, 5.4, 0); body.castShadow = true; body.receiveShadow = true; g.add(body);
    var base = new THREE.Mesh(new THREE.BoxGeometry(32.1, 1.2, 16.1), M.white);
    base.position.set(8, 0.9, 0); g.add(base);
    for (var i = 0; i < 2; i++) {
      var band = new THREE.Mesh(new THREE.BoxGeometry(32.05, 0.15, 16.05), M.brickDark);
      band.position.set(8, 4.2 + i * 3.3, 0); g.add(band);
    }
    var parapet = new THREE.Mesh(new THREE.BoxGeometry(32.2, 0.5, 16.2), M.brickDark);
    parapet.position.set(8, 10.65, 0); g.add(parapet);
    var roof = new THREE.Mesh(new THREE.BoxGeometry(32, 0.15, 16), M.roofDark);
    roof.position.set(8, 10.95, 0); g.add(roof);
    // Front windows
    for (var floor = 0; floor < 3; floor++) {
      var y = 2.2 + floor * 3.3;
      for (var col = 0; col < 8; col++) {
        var x = -5 + col * 4;
        var frame = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.4, 0.12), M.windowFrame);
        frame.position.set(x, y, 8.06); g.add(frame);
        var glass = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.1, 0.08), M.glass);
        glass.position.set(x, y, 8.1); g.add(glass);
        var div = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.05, 0.14), M.windowFrame);
        div.position.set(x, y, 8.08); g.add(div);
      }
    }
    // Back windows
    for (var floor = 0; floor < 3; floor++) {
      var y = 2.2 + floor * 3.3;
      for (var col = 0; col < 8; col++) {
        var x = -5 + col * 4;
        var frame = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.4, 0.12), M.windowFrame);
        frame.position.set(x, y, -8.06); g.add(frame);
        var glass = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.1, 0.08), M.glass);
        glass.position.set(x, y, -8.1); g.add(glass);
      }
    }
    // Right side windows
    for (var floor = 0; floor < 3; floor++) {
      var y = 2.2 + floor * 3.3;
      for (var col = 0; col < 3; col++) {
        var z = -4 + col * 4;
        var frame = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 3.2), M.windowFrame);
        frame.position.set(24.06, y, z); g.add(frame);
        var glass = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 2.8), M.glass);
        glass.position.set(24.1, y, z); g.add(glass);
      }
    }
    return g;
  }

  // Left wing (taller, stepped)
  function createLeftWing() {
    var g = new THREE.Group();
    var lowerBlock = new THREE.Mesh(new THREE.BoxGeometry(14, 10, 18), M.brick);
    lowerBlock.position.set(-13, 5.4, -1); lowerBlock.castShadow = true; lowerBlock.receiveShadow = true; g.add(lowerBlock);
    var upperBlock = new THREE.Mesh(new THREE.BoxGeometry(12, 4, 14), M.brick);
    upperBlock.position.set(-14, 12.4, -1); upperBlock.castShadow = true; g.add(upperBlock);
    var upperAccent = new THREE.Mesh(new THREE.BoxGeometry(12.05, 0.15, 14.05), M.brickDark);
    upperAccent.position.set(-14, 10.7, -1); g.add(upperAccent);
    var upperParapet = new THREE.Mesh(new THREE.BoxGeometry(12.2, 0.4, 14.2), M.brickDark);
    upperParapet.position.set(-14, 14.6, -1); g.add(upperParapet);
    var upperRoof = new THREE.Mesh(new THREE.BoxGeometry(12, 0.15, 14), M.roofDark);
    upperRoof.position.set(-14, 14.85, -1); g.add(upperRoof);
    var base = new THREE.Mesh(new THREE.BoxGeometry(14.1, 1.2, 18.1), M.white);
    base.position.set(-13, 0.9, -1); g.add(base);
    var lowerRoof = new THREE.Mesh(new THREE.BoxGeometry(14, 0.15, 18), M.roofDark);
    lowerRoof.position.set(-13, 10.95, -1); g.add(lowerRoof);
    // Front windows (lower 3 floors)
    for (var floor = 0; floor < 3; floor++) {
      var y = 2.2 + floor * 3.3;
      for (var col = 0; col < 3; col++) {
        var x = -18 + col * 4;
        var frame = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.4, 0.12), M.windowFrame);
        frame.position.set(x, y, 8.06); g.add(frame);
        var glass = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.1, 0.08), M.glass);
        glass.position.set(x, y, 8.1); g.add(glass);
        var div = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.05, 0.14), M.windowFrame);
        div.position.set(x, y, 8.08); g.add(div);
      }
    }
    // 4th floor windows
    for (var col = 0; col < 2; col++) {
      var x = -17 + col * 5;
      var frame = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.4, 0.12), M.windowFrame);
      frame.position.set(x, 12.4, 6.06); g.add(frame);
      var glass = new THREE.Mesh(new THREE.BoxGeometry(3.1, 1.1, 0.08), M.glassReflect);
      glass.position.set(x, 12.4, 6.1); g.add(glass);
    }
    // Left side windows
    for (var floor = 0; floor < 3; floor++) {
      var y = 2.2 + floor * 3.3;
      for (var col = 0; col < 4; col++) {
        var z = -7 + col * 4;
        var frame = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 3.0), M.windowFrame);
        frame.position.set(-20.06, y, z); g.add(frame);
        var glass = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 2.6), M.glass);
        glass.position.set(-20.1, y, z); g.add(glass);
      }
    }
    for (var col = 0; col < 3; col++) {
      var z = -6 + col * 4;
      var frame = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 3.0), M.windowFrame);
      frame.position.set(-20.06, 12.4, z); g.add(frame);
      var glass = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 2.6), M.glassReflect);
      glass.position.set(-20.1, 12.4, z); g.add(glass);
    }
    // Back windows
    for (var floor = 0; floor < 3; floor++) {
      var y = 2.2 + floor * 3.3;
      for (var col = 0; col < 3; col++) {
        var x = -18 + col * 4;
        var frame = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.4, 0.12), M.windowFrame);
        frame.position.set(x, y, -10.06); g.add(frame);
        var glass = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.1, 0.08), M.glass);
        glass.position.set(x, y, -10.1); g.add(glass);
      }
    }
    return g;
  }

  // Entrance area
  function createEntrance() {
    var g = new THREE.Group();
    var canopy = new THREE.Mesh(new THREE.BoxGeometry(8, 0.3, 4), M.concrete);
    canopy.position.set(-17, 3.5, 10.5); canopy.castShadow = true; g.add(canopy);
    for (var i = 0; i < 2; i++) {
      var col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 3.2, 8), M.white);
      col.position.set(-14.5 + i * 5, 1.7, 12); col.castShadow = true; g.add(col);
    }
    var door = new THREE.Mesh(new THREE.BoxGeometry(3, 2.8, 0.2), M.windowFrame);
    door.position.set(-15, 1.7, 8.15); g.add(door);
    var doorGlass = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 0.1), M.glass);
    doorGlass.position.set(-15, 1.8, 8.2); g.add(doorGlass);
    // Aalto "A!" logo sign
    var signBg = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.8, 0.15), M.white);
    signBg.position.set(-11.8, 2.6, 8.15); g.add(signBg);
    // Bold geometric "A" with triangular cutout
    var aShape = new THREE.Shape();
    aShape.moveTo(0, 0);
    aShape.lineTo(0.45, 1.1);
    aShape.lineTo(0.9, 0);
    aShape.lineTo(0.72, 0);
    aShape.lineTo(0.62, 0.22);
    aShape.lineTo(0.28, 0.22);
    aShape.lineTo(0.18, 0);
    aShape.closePath();
    var aHole = new THREE.Path();
    aHole.moveTo(0.33, 0.32);
    aHole.lineTo(0.45, 0.65);
    aHole.lineTo(0.57, 0.32);
    aHole.closePath();
    aShape.holes.push(aHole);
    var aGeo = new THREE.ExtrudeGeometry(aShape, { depth: 0.08, bevelEnabled: false });
    var aMesh = new THREE.Mesh(aGeo, M.windowFrame);
    aMesh.position.set(-12.6, 2.0, 8.2); g.add(aMesh);
    // Exclamation mark "!" bar
    var excBar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.75, 0.08), M.windowFrame);
    excBar.position.set(-11.5, 2.55, 8.25); g.add(excBar);
    // Exclamation mark "!" dot
    var excDot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.08), M.windowFrame);
    excDot.position.set(-11.5, 2.05, 8.25); g.add(excDot);
    return g;
  }

  // Rooftop structures
  function createRooftop() {
    var g = new THREE.Group();
    var skylightBase = new THREE.Mesh(new THREE.BoxGeometry(6, 0.2, 4), M.metal);
    skylightBase.position.set(-14, 14.95, -1); g.add(skylightBase);
    var slGlass = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.08, 3.5), M.glassReflect);
    slGlass.position.set(-14, 15.3, -1); slGlass.rotation.x = 0.15; g.add(slGlass);
    var slFrame = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.2, 0.1), M.metal);
    slFrame.position.set(-14, 15.5, 0.7); g.add(slFrame);
    var slFrame2 = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.2, 0.1), M.metal);
    slFrame2.position.set(-14, 15.2, -2.7); g.add(slFrame2);
    var hvac = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.2, 2), M.metal);
    hvac.position.set(12, 11.7, -2); g.add(hvac);
    var hvac2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.8, 1.5), M.metal);
    hvac2.position.set(5, 11.5, 2); g.add(hvac2);
    return g;
  }

  // Chimney/tower
  function createChimney() {
    var g = new THREE.Group();
    var chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 28, 12), M.metalWhite);
    chimney.position.set(18, 14, -14); chimney.castShadow = true; g.add(chimney);
    for (var i = 0; i < 8; i++) {
      var ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.06, 6, 12), M.metal);
      ring.position.set(18, 3 + i * 3.3, -14); ring.rotation.x = Math.PI / 2; g.add(ring);
    }
    return g;
  }

  // Flagpoles with waving flags
  function createFlagpoles() {
    var g = new THREE.Group();
    var positions = [
      { x: 6, z: 13, flagMat: M.flagYellow },
      { x: 10, z: 13, flagMat: M.flagBlue },
      { x: 14, z: 13, flagMat: M.flagBlue }
    ];
    positions.forEach(function(p) {
      var pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 12, 6), M.metal);
      pole.position.set(p.x, 6, p.z); pole.castShadow = true; g.add(pole);
      // Subdivided flag for vertex wave animation
      var flagGeo = new THREE.PlaneGeometry(1.5, 1, 15, 8);
      var flag = new THREE.Mesh(flagGeo, p.flagMat);
      flag.position.set(p.x + 0.8, 11, p.z);
      flag.rotation.y = -0.1;
      flag.castShadow = true;
      // Store original vertex positions for wave displacement
      flag.userData.origPos = new Float32Array(flagGeo.attributes.position.array);
      flag.userData.phaseOffset = p.x;
      flagMeshes.push(flag);
      g.add(flag);
      var top = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), M.metal);
      top.position.set(p.x, 12.05, p.z); g.add(top);
    });
    return g;
  }

  // Road & crosswalk
  function createRoad() {
    var g = new THREE.Group();
    var road = new THREE.Mesh(new THREE.BoxGeometry(70, 0.08, 10), M.asphalt);
    road.position.set(0, 0.04, 22); road.receiveShadow = true; g.add(road);
    var sidewalk = new THREE.Mesh(new THREE.BoxGeometry(70, 0.12, 4), M.concrete);
    sidewalk.position.set(0, 0.06, 15.5); sidewalk.receiveShadow = true; g.add(sidewalk);
    for (var i = 0; i < 7; i++) {
      var stripe = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 8), M.stripe);
      stripe.position.set(-4 + i * 1.2, 0.1, 22); g.add(stripe);
    }
    var centerLine = new THREE.Mesh(new THREE.BoxGeometry(25, 0.1, 0.15), M.stripe);
    centerLine.position.set(20, 0.1, 22); g.add(centerLine);
    var curb = new THREE.Mesh(new THREE.BoxGeometry(70, 0.2, 0.3), M.whiteTrim);
    curb.position.set(0, 0.1, 17.3); g.add(curb);
    var cobble = new THREE.Mesh(new THREE.BoxGeometry(12, 0.06, 5), M.asphaltLight);
    cobble.position.set(12, 0.03, 12); g.add(cobble);
    return g;
  }

  // Landscape
  function createLandscape() {
    var g = new THREE.Group();
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(150, 150), M.grass);
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.01; ground.receiveShadow = true; g.add(ground);
    var grassPatch = new THREE.Mesh(new THREE.BoxGeometry(8, 0.08, 5), M.grassLight);
    grassPatch.position.set(-5, 0.04, 12); g.add(grassPatch);
    var grassPatch2 = new THREE.Mesh(new THREE.BoxGeometry(6, 0.08, 4), M.grassLight);
    grassPatch2.position.set(20, 0.04, 12); g.add(grassPatch2);

    function createPine(x, z, h, scale) {
      var tg = new THREE.Group();
      var trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15 * scale, 0.2 * scale, h, 6),
        new THREE.MeshStandardMaterial({ color: 0x5a4030, roughness: 0.9 }));
      trunk.position.set(x, h / 2, z); trunk.castShadow = true; tg.add(trunk);
      var foliageDark = new THREE.MeshStandardMaterial({ color: 0x1e4a20, roughness: 0.85 });
      var foliageMed = new THREE.MeshStandardMaterial({ color: 0x2a5a2a, roughness: 0.85 });
      for (var i = 0; i < 4; i++) {
        var r = (2.2 - i * 0.35) * scale;
        var foliage = new THREE.Mesh(new THREE.ConeGeometry(r, 2.5 * scale, 7), i % 2 === 0 ? foliageDark : foliageMed);
        foliage.position.set(x, h + 0.3 * scale + i * 1.6 * scale, z); foliage.castShadow = true; tg.add(foliage);
      }
      return tg;
    }

    g.add(createPine(-24, -12, 3, 1.2)); g.add(createPine(-28, -8, 4, 1.0));
    g.add(createPine(-22, -15, 3.5, 1.1)); g.add(createPine(-18, -14, 2.5, 0.9));
    g.add(createPine(22, -12, 3.5, 1.1)); g.add(createPine(26, -10, 4, 1.0));
    g.add(createPine(30, -14, 3, 1.2)); g.add(createPine(-26, 5, 3, 1.0));
    g.add(createPine(-30, 2, 4, 1.1));

    function createDeciduous(x, z, h) {
      var tg = new THREE.Group();
      var trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, h, 6),
        new THREE.MeshStandardMaterial({ color: 0x5a4030, roughness: 0.9 }));
      trunk.position.set(x, h / 2, z); trunk.castShadow = true; tg.add(trunk);
      var canopy = new THREE.Mesh(new THREE.SphereGeometry(2.5, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x3a7a30, roughness: 0.85 }));
      canopy.position.set(x, h + 1.5, z); canopy.scale.set(1, 0.8, 1); canopy.castShadow = true; tg.add(canopy);
      return tg;
    }

    g.add(createDeciduous(28, 10, 3)); g.add(createDeciduous(-24, 10, 2.5));

    function createBush(x, z) {
      var bush = new THREE.Mesh(new THREE.SphereGeometry(0.7, 6, 6),
        new THREE.MeshStandardMaterial({ color: 0x3a6a2a, roughness: 0.9 }));
      bush.position.set(x, 0.5, z); bush.scale.set(1.2, 0.8, 1); return bush;
    }

    g.add(createBush(-13, 10)); g.add(createBush(-11, 10.5)); g.add(createBush(-14.5, 10.5));

    function createRoadSign(x, z, color) {
      var sg = new THREE.Group();
      var post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.5, 6), M.metal);
      post.position.set(x, 1.75, z); sg.add(post);
      var sign = new THREE.Mesh(new THREE.CircleGeometry(0.45, 8),
        new THREE.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.1 }));
      sign.position.set(x, 3.5, z + 0.05); sg.add(sign);
      return sg;
    }

    g.add(createRoadSign(-9, 17, 0x2244aa)); g.add(createRoadSign(-12, 17, 0xcc3322));

    for (var i = 0; i < 3; i++) {
      var rack = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.03, 6, 8, Math.PI), M.metal);
      rack.position.set(-19 + i * 1.2, 0.4, 10); g.add(rack);
    }

    return g;
  }

  // Assemble building
  bldg.add(createRightWing()); bldg.add(createLeftWing()); bldg.add(createEntrance());
  bldg.add(createRooftop()); bldg.add(createChimney()); bldg.add(createFlagpoles());
  bldg.add(createRoad()); bldg.add(createLandscape());
  scene.add(bldg);

  // Lighting
  var ambient = new THREE.AmbientLight(0x8899bb, 0.5);
  scene.add(ambient);
  var sun = new THREE.DirectionalLight(0xffeedd, 1.0);
  sun.position.set(30, 35, 20); sun.castShadow = true;
  sun.shadow.mapSize.width = 2048; sun.shadow.mapSize.height = 2048;
  sun.shadow.camera.near = 0.5; sun.shadow.camera.far = 100;
  sun.shadow.camera.left = -45; sun.shadow.camera.right = 45;
  sun.shadow.camera.top = 45; sun.shadow.camera.bottom = -45;
  sun.shadow.bias = -0.001; scene.add(sun);
  var fill = new THREE.DirectionalLight(0x99bbdd, 0.35);
  fill.position.set(-20, 15, -15); scene.add(fill);
  var bounce = new THREE.HemisphereLight(0x88aa66, 0x334455, 0.3);
  scene.add(bounce);

  // Camera orbit controls
  var isDragging = false;
  var prev = { x: 0, y: 0 };
  var sph = { theta: 0.6, phi: 1.05, radius: 50 };

  function updateCam() {
    camera.position.x = sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta);
    camera.position.y = sph.radius * Math.cos(sph.phi);
    camera.position.z = sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta);
    camera.lookAt(0, 5, 0);
  }

  var el = renderer.domElement;
  el.addEventListener('mousedown', function(e) { isDragging = true; prev = { x: e.clientX, y: e.clientY }; });
  el.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    sph.theta -= (e.clientX - prev.x) * 0.005;
    sph.phi = Math.max(0.25, Math.min(Math.PI * 0.48, sph.phi + (e.clientY - prev.y) * 0.005));
    prev = { x: e.clientX, y: e.clientY };
  });
  el.addEventListener('mouseup', function() { isDragging = false; });
  el.addEventListener('mouseleave', function() { isDragging = false; });
  el.addEventListener('touchstart', function(e) { isDragging = true; prev = { x: e.touches[0].clientX, y: e.touches[0].clientY }; });
  el.addEventListener('touchmove', function(e) {
    if (!isDragging) return; e.preventDefault();
    sph.theta -= (e.touches[0].clientX - prev.x) * 0.005;
    sph.phi = Math.max(0.25, Math.min(Math.PI * 0.48, sph.phi + (e.touches[0].clientY - prev.y) * 0.005));
    prev = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: false });
  el.addEventListener('touchend', function() { isDragging = false; });
  el.addEventListener('wheel', function(e) {
    e.preventDefault();
    sph.radius = Math.max(25, Math.min(100, sph.radius + e.deltaY * 0.05));
  }, { passive: false });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    if (!isDragging) sph.theta += 0.0015;
    updateCam();
    // Wave flag vertices
    var time = Date.now() * 0.003;
    flagMeshes.forEach(function(flag) {
      var pos = flag.geometry.attributes.position;
      var orig = flag.userData.origPos;
      var phase = flag.userData.phaseOffset;
      for (var i = 0; i < pos.count; i++) {
        var ox = orig[i * 3];
        var oy = orig[i * 3 + 1];
        var oz = orig[i * 3 + 2];
        // Amplitude increases from pole edge (left) to flag tip (right)
        var amt = (ox + 0.75) * 0.22;
        pos.array[i * 3 + 2] = oz + Math.sin(ox * 4.0 + time + phase) * amt;
        pos.array[i * 3 + 1] = oy + Math.sin(ox * 3.0 + time * 1.3 + phase) * amt * 0.15;
      }
      pos.needsUpdate = true;
      flag.geometry.computeVertexNormals();
    });
    renderer.render(scene, camera);
  }
  animate();

  // Responsive resize
  if (typeof ResizeObserver !== 'undefined') {
    var ro = new ResizeObserver(function(entries) {
      var w = entries[0].contentRect.width;
      var h = entries[0].contentRect.height;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    ro.observe(container);
  }
}

// ===== 3D STREET SCENE (Three.js) =====
function initStreetScene3D(){
  var container=document.getElementById('streetScene3D');
  if(!container||typeof THREE==='undefined')return;

  // Scene
  var scene=new THREE.Scene();
  scene.background=new THREE.Color(0x2a2a35);
  scene.fog=new THREE.FogExp2(0x2a2a35,0.012);

  // Camera - cinematic street-level angle
  var w=container.clientWidth,h=container.clientHeight;
  var camera=new THREE.PerspectiveCamera(50,w/h,0.1,200);
  camera.position.set(0,12,22);
  camera.lookAt(0,2,-5);

  // Renderer
  var renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(w,h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=0.9;
  container.appendChild(renderer.domElement);

  // Materials (flat-shaded voxel style)
  function mat(hex){return new THREE.MeshLambertMaterial({color:hex});}
  function matFlat(hex){return new THREE.MeshLambertMaterial({color:hex,flatShading:true});}
  var mRoad=mat(0x3a3a3a);
  var mSidewalk=mat(0x707070);
  var mCurb=mat(0x888888);
  var mYellow=mat(0xc8b860);
  var mWhite=mat(0xcccccc);
  var mGrass=mat(0x2a5a2a);
  var mWindowLit=new THREE.MeshBasicMaterial({color:0xeedd88});
  var mWindowDark=new THREE.MeshBasicMaterial({color:0x3a3a50});
  var mWindowBlue=new THREE.MeshBasicMaterial({color:0x6688aa});
  var mGlass=new THREE.MeshPhongMaterial({color:0x88aacc,transparent:true,opacity:0.5,shininess:100});
  var mPole=mat(0x555555);
  var mSkin=mat(0xd4a574);
  var mHair=mat(0x5a3a1a);
  var mShirt=mat(0x4466aa);
  var mPants=mat(0x333333);
  var mShoe=mat(0x222222);

  // Helper: create box mesh
  function box(w2,h2,d,material,x,y,z){
    var g=new THREE.BoxGeometry(w2,h2,d);
    var m=new THREE.Mesh(g,material);
    m.position.set(x,y,z);
    m.castShadow=true;m.receiveShadow=true;
    return m;
  }

  // ===== GROUND / ROAD =====
  // Grass far back
  var grassBack=box(80,0.1,20,mGrass,0,0,-22);
  grassBack.receiveShadow=true;scene.add(grassBack);

  // Back sidewalk
  var sidewalkBack=box(80,0.2,3,mSidewalk,0,0.1,-11);
  sidewalkBack.receiveShadow=true;scene.add(sidewalkBack);

  // Curb back
  scene.add(box(80,0.3,0.3,mCurb,0,0.15,-9.4));

  // Road surface
  var road=box(80,0.05,12,mRoad,0,0,-3);
  road.receiveShadow=true;scene.add(road);

  // Curb front
  scene.add(box(80,0.3,0.3,mCurb,0,0.15,3.4));

  // Front sidewalk
  var sidewalkFront=box(80,0.2,4,mSidewalk,0,0.1,5.5);
  sidewalkFront.receiveShadow=true;scene.add(sidewalkFront);

  // Front grass
  var grassFront=box(80,0.1,10,mGrass,0,0,12.5);
  grassFront.receiveShadow=true;scene.add(grassFront);

  // Center dashed line
  for(var i=-40;i<40;i+=3){
    scene.add(box(1.8,0.06,0.2,mYellow,i+0.9,0.03,-3));
  }

  // Crosswalk stripes
  for(var j=0;j<6;j++){
    scene.add(box(0.5,0.06,11,mWhite,2+j*1.2,0.03,-3));
  }

  // Lane arrows (flat triangles on road)
  function addArrow(ax,az,rot){
    var shape=new THREE.Shape();
    shape.moveTo(0,0.6);shape.lineTo(-0.4,0);shape.lineTo(-0.15,0);
    shape.lineTo(-0.15,-0.6);shape.lineTo(0.15,-0.6);shape.lineTo(0.15,0);
    shape.lineTo(0.4,0);shape.closePath();
    var geo=new THREE.ShapeGeometry(shape);
    var arrow=new THREE.Mesh(geo,mYellow);
    arrow.rotation.x=-Math.PI/2;
    arrow.rotation.z=rot;
    arrow.position.set(ax,0.04,az);
    scene.add(arrow);
  }
  addArrow(-8,-6,0);addArrow(-8,0,Math.PI);
  addArrow(14,-6,0);addArrow(14,0,Math.PI);

  // ===== BUILDINGS =====
  var buildingDefs=[
    {x:-18,w:7,h:14,d:6,color:0x6a6a6a,roofColor:0x555555,floors:4,winCols:3},
    {x:-10,w:6,h:10,d:5,color:0x7a6a5a,roofColor:0x5a4a3a,floors:3,winCols:2},
    {x:-4,w:5,h:16,d:5,color:0x5a6a7a,roofColor:0x4a5a6a,floors:5,winCols:2},
    {x:3,w:8,h:12,d:7,color:0x6e6e6e,roofColor:0x505050,floors:4,winCols:3},
    {x:12,w:6,h:18,d:5,color:0x7a7070,roofColor:0x5a5050,floors:5,winCols:2},
    {x:19,w:7,h:9,d:6,color:0x607060,roofColor:0x405040,floors:3,winCols:3},
    {x:27,w:5,h:13,d:5,color:0x6a6a7a,roofColor:0x4a4a5a,floors:4,winCols:2}
  ];

  buildingDefs.forEach(function(bd){
    var bGroup=new THREE.Group();
    // Main body
    var body=box(bd.w,bd.h,bd.d,matFlat(bd.color),0,bd.h/2,0);
    bGroup.add(body);
    // Roof edge
    bGroup.add(box(bd.w+0.3,0.3,bd.d+0.3,mat(bd.roofColor),0,bd.h+0.15,0));
    // Side face (darker)
    var sideFace=box(0.05,bd.h,bd.d,mat(bd.color-0x101010),bd.w/2+0.025,bd.h/2,0);
    bGroup.add(sideFace);

    // Windows
    var floorH=bd.h/bd.floors;
    var winW=0.7,winH=floorH*0.5;
    var spacing=bd.w/(bd.winCols+1);
    for(var f=0;f<bd.floors;f++){
      for(var c2=0;c2<bd.winCols;c2++){
        var wy=floorH*(f+0.5)+winH/2;
        var wx=-bd.w/2+spacing*(c2+1);
        var lit=Math.random()>0.4;
        var wMat=lit?(Math.random()>0.5?mWindowLit:mWindowBlue):mWindowDark;
        var win=box(winW,winH,0.06,wMat,wx,wy,bd.d/2+0.03);
        win.castShadow=false;
        bGroup.add(win);
        // Window frame
        var frame=box(winW+0.1,winH+0.1,0.02,mat(0x444444),wx,wy,bd.d/2+0.01);
        frame.castShadow=false;
        bGroup.add(frame);
        // Window cross bars
        bGroup.add(box(winW,0.05,0.07,mat(0x555555),wx,wy,bd.d/2+0.04));
        bGroup.add(box(0.05,winH,0.07,mat(0x555555),wx,wy,bd.d/2+0.04));
      }
    }

    // Door on ground floor (random building)
    if(Math.random()>0.4){
      var doorW=1.2,doorH=2.2;
      bGroup.add(box(doorW,doorH,0.1,mat(0x4a3020),0,doorH/2,bd.d/2+0.05));
      bGroup.add(box(doorW+0.2,0.15,0.15,mat(0x555555),0,doorH+0.07,bd.d/2+0.05));
    }

    // Rooftop details
    if(bd.h>11){
      // AC unit
      bGroup.add(box(1,0.6,0.8,mat(0x888888),bd.w*0.2,bd.h+0.6,0));
      bGroup.add(box(0.4,0.3,0.4,mat(0x666666),bd.w*0.2,bd.h+1.05,0));
    }
    if(bd.h>14){
      // Antenna
      var antennaX=bd.w*-0.3;
      bGroup.add(box(0.08,3,0.08,mat(0x666666),antennaX,bd.h+1.5,0));
      bGroup.add(box(0.04,0.04,0.04,new THREE.MeshBasicMaterial({color:0xff3333}),antennaX,bd.h+3.02,0));
    }

    bGroup.position.set(bd.x,0,-12);
    scene.add(bGroup);
  });

  // ===== TRAFFIC LIGHT =====
  var tlGroup=new THREE.Group();
  // Pole
  tlGroup.add(box(0.2,6,0.2,mPole,0,3,0));
  // Arm
  tlGroup.add(box(2.5,0.15,0.15,mPole,1.25,5.8,0));
  // Light housing
  tlGroup.add(box(0.8,2,0.6,mat(0x333333),2.5,5,0));
  // Red light
  var redLight=new THREE.Mesh(new THREE.SphereGeometry(0.22,8,8),new THREE.MeshBasicMaterial({color:0xff2222}));
  redLight.position.set(2.5,5.6,0.32);tlGroup.add(redLight);
  // Yellow light
  var yellowLight=new THREE.Mesh(new THREE.SphereGeometry(0.22,8,8),new THREE.MeshBasicMaterial({color:0x443300}));
  yellowLight.position.set(2.5,5.0,0.32);tlGroup.add(yellowLight);
  // Green light
  var greenLight=new THREE.Mesh(new THREE.SphereGeometry(0.22,8,8),new THREE.MeshBasicMaterial({color:0x003300}));
  greenLight.position.set(2.5,4.4,0.32);tlGroup.add(greenLight);
  tlGroup.position.set(0,0,-9.3);
  scene.add(tlGroup);

  // ===== STREET CHARACTER (voxel person on sidewalk) =====
  var personGroup=new THREE.Group();
  // Head
  personGroup.add(box(0.5,0.5,0.5,mSkin,0,2.05,0));
  // Hair
  personGroup.add(box(0.52,0.2,0.52,mHair,0,2.4,0));
  // Eyes
  personGroup.add(box(0.08,0.08,0.05,mat(0x222222),-0.12,2.1,0.26));
  personGroup.add(box(0.08,0.08,0.05,mat(0x222222),0.12,2.1,0.26));
  // Torso
  personGroup.add(box(0.6,0.7,0.35,mShirt,0,1.45,0));
  // Arms
  personGroup.add(box(0.18,0.6,0.18,mShirt,-0.39,1.45,0));
  personGroup.add(box(0.18,0.6,0.18,mShirt,0.39,1.45,0));
  // Hands
  personGroup.add(box(0.15,0.15,0.15,mSkin,-0.39,1.08,0));
  personGroup.add(box(0.15,0.15,0.15,mSkin,0.39,1.08,0));
  // Legs
  personGroup.add(box(0.22,0.7,0.25,mPants,-0.15,0.65,0));
  personGroup.add(box(0.22,0.7,0.25,mPants,0.15,0.65,0));
  // Shoes
  personGroup.add(box(0.24,0.15,0.35,mShoe,-0.15,0.22,0.05));
  personGroup.add(box(0.24,0.15,0.35,mShoe,0.15,0.22,0.05));
  personGroup.position.set(1,0.1,-9.5);
  scene.add(personGroup);

  // ===== STREET FURNITURE =====
  // Street lamp left
  function addStreetLamp(lx,lz){
    var lamp=new THREE.Group();
    lamp.add(box(0.15,5,0.15,mat(0x555555),0,2.5,0));
    lamp.add(box(1.5,0.1,0.1,mat(0x555555),0.75,4.9,0));
    var bulb=new THREE.Mesh(new THREE.SphereGeometry(0.2,6,6),new THREE.MeshBasicMaterial({color:0xffdd88}));
    bulb.position.set(1.5,4.7,0);lamp.add(bulb);
    // Point light from lamp
    var pl=new THREE.PointLight(0xffdd88,0.5,10);
    pl.position.set(1.5,4.5,0);lamp.add(pl);
    lamp.position.set(lx,0,lz);
    scene.add(lamp);
  }
  addStreetLamp(-12,-9.5);addStreetLamp(10,-9.5);addStreetLamp(-20,5.5);addStreetLamp(22,5.5);

  // Fire hydrant
  var hydrant=new THREE.Group();
  hydrant.add(box(0.3,0.6,0.3,mat(0xcc3333),0,0.4,0));
  hydrant.add(box(0.15,0.2,0.15,mat(0xcc3333),0,0.8,0));
  hydrant.add(box(0.5,0.1,0.15,mat(0xaa2222),0,0.55,0));
  hydrant.position.set(-6,0,5.2);scene.add(hydrant);

  // Bench
  var bench=new THREE.Group();
  bench.add(box(2,0.1,0.5,mat(0x6a4a2a),0,0.6,0));
  bench.add(box(2,0.5,0.08,mat(0x6a4a2a),0,0.85,-0.21));
  bench.add(box(0.1,0.6,0.1,mat(0x444444),-0.9,0.3,0));
  bench.add(box(0.1,0.6,0.1,mat(0x444444),0.9,0.3,0));
  bench.position.set(18,0.1,5.5);scene.add(bench);

  // Trash can
  var trash=new THREE.Group();
  var trashBody=new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.2,0.7,8),mat(0x556655));
  trashBody.position.y=0.45;trashBody.castShadow=true;trash.add(trashBody);
  trash.position.set(-14,0,5.2);scene.add(trash);

  // ===== TREES =====
  function addTree(tx,tz,scale){
    var tree=new THREE.Group();
    // Trunk
    tree.add(box(0.3*scale,1.5*scale,0.3*scale,mat(0x5a3a1a),0,0.75*scale,0));
    // Foliage (stacked voxel cubes)
    var leafMat=mat(0x2a6a2a);
    tree.add(box(1.6*scale,1*scale,1.6*scale,leafMat,0,2*scale,0));
    tree.add(box(1.2*scale,0.8*scale,1.2*scale,leafMat,0,2.7*scale,0));
    tree.add(box(0.7*scale,0.5*scale,0.7*scale,leafMat,0,3.2*scale,0));
    tree.position.set(tx,0,tz);
    scene.add(tree);
  }
  addTree(-25,-14,1);addTree(-8,-14,0.8);addTree(8,-14,1.1);addTree(25,-14,0.9);
  addTree(-18,8,0.7);addTree(6,9,1);addTree(25,10,0.8);

  // ===== LIGHTING =====
  // Ambient
  scene.add(new THREE.AmbientLight(0x404050,0.6));
  // Main directional (moonlight/street vibe)
  var dirLight=new THREE.DirectionalLight(0xaabbcc,0.8);
  dirLight.position.set(10,20,10);
  dirLight.castShadow=true;
  dirLight.shadow.mapSize.width=1024;
  dirLight.shadow.mapSize.height=1024;
  dirLight.shadow.camera.left=-30;dirLight.shadow.camera.right=30;
  dirLight.shadow.camera.top=20;dirLight.shadow.camera.bottom=-10;
  dirLight.shadow.camera.near=1;dirLight.shadow.camera.far=50;
  scene.add(dirLight);
  // Warm fill from street level
  var fillLight=new THREE.DirectionalLight(0xffddaa,0.3);
  fillLight.position.set(-5,3,8);scene.add(fillLight);
  // Hemisphere
  scene.add(new THREE.HemisphereLight(0x334455,0x222211,0.4));

  // ===== 3D CAR BUILDER =====
  var streetCars=[];
  var carColorValues=[0xcc3333,0x3366cc,0x33aa55,0xccaa33,0xcc6633,0x9933cc,0x33cccc,0xff6699];

  function createCar3D(color){
    var carGroup=new THREE.Group();
    var cMat=matFlat(color);
    // Body
    carGroup.add(box(2.4,0.6,1.2,cMat,0,0.5,0));
    // Cabin
    carGroup.add(box(1.4,0.5,1.1,cMat,0.1,1.0,0));
    // Windshield front
    carGroup.add(box(0.05,0.4,0.9,mGlass,-0.6,1.0,0));
    // Windshield rear
    carGroup.add(box(0.05,0.4,0.9,mGlass,0.8,1.0,0));
    // Side windows
    carGroup.add(box(0.6,0.35,0.05,mGlass,0.1,1.0,0.56));
    carGroup.add(box(0.6,0.35,0.05,mGlass,0.1,1.0,-0.56));
    // Wheels
    var wheelGeo=new THREE.CylinderGeometry(0.22,0.22,0.15,8);
    var wheelMat=mat(0x222222);
    var hubMat=mat(0x888888);
    [[-0.7,-0.65],[0.7,-0.65],[-0.7,0.65],[0.7,0.65]].forEach(function(wp){
      var wheel=new THREE.Mesh(wheelGeo,wheelMat);
      wheel.rotation.x=Math.PI/2;
      wheel.position.set(wp[0],0.22,wp[1]);
      wheel.castShadow=true;
      carGroup.add(wheel);
      // Hub cap
      var hub=new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.1,0.16,6),hubMat);
      hub.rotation.x=Math.PI/2;hub.position.set(wp[0],0.22,wp[1]);
      carGroup.add(hub);
    });
    // Headlights
    var hlMat=new THREE.MeshBasicMaterial({color:0xffffcc});
    carGroup.add(box(0.05,0.15,0.2,hlMat,-1.22,0.55,-0.35));
    carGroup.add(box(0.05,0.15,0.2,hlMat,-1.22,0.55,0.35));
    // Taillights
    var tlMat=new THREE.MeshBasicMaterial({color:0xff2222});
    carGroup.add(box(0.05,0.15,0.2,tlMat,1.22,0.55,-0.35));
    carGroup.add(box(0.05,0.15,0.2,tlMat,1.22,0.55,0.35));
    // Bumpers
    carGroup.add(box(0.1,0.15,1.0,mat(0x444444),-1.25,0.35,0));
    carGroup.add(box(0.1,0.15,1.0,mat(0x444444),1.25,0.35,0));

    carGroup.castShadow=true;
    return carGroup;
  }

  function spawnCar(lane){
    var color=carColorValues[Math.floor(Math.random()*carColorValues.length)];
    var carMesh=createCar3D(color);
    var dir,zPos,startX;
    if(lane===0){
      // Near lane - drives right (+x)
      dir=1;zPos=-1.5;startX=-35;
      carMesh.rotation.y=Math.PI/2;
    } else {
      // Far lane - drives left (-x)
      dir=-1;zPos=-4.5;startX=35;
      carMesh.rotation.y=-Math.PI/2;
    }
    carMesh.position.set(startX,0.05,zPos);
    scene.add(carMesh);
    var speed=0.06+Math.random()*0.08;
    streetCars.push({mesh:carMesh,dir:dir,speed:speed,lane:lane});
  }

  // Auto-spawn a few initial cars
  for(var k=0;k<3;k++){
    setTimeout(function(){spawnCar(Math.random()>0.5?0:1);},k*800);
  }

  // ===== RAYCASTER FOR CLICK-TO-SPAWN =====
  var raycaster=new THREE.Raycaster();
  var mouse=new THREE.Vector2();
  var roadPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);

  renderer.domElement.addEventListener('click',function(e){
    if(isDragging)return;
    var rect=renderer.domElement.getBoundingClientRect();
    mouse.x=((e.clientX-rect.left)/rect.width)*2-1;
    mouse.y=-((e.clientY-rect.top)/rect.height)*2+1;
    raycaster.setFromCamera(mouse,camera);
    var pt=new THREE.Vector3();
    raycaster.ray.intersectPlane(roadPlane,pt);
    if(pt){
      // Check if click is on road area (z between -9 and 3)
      if(pt.z>-8.5&&pt.z<3){
        var lane=pt.z>-3?0:1;
        var color=carColorValues[Math.floor(Math.random()*carColorValues.length)];
        var carMesh=createCar3D(color);
        var dir=lane===0?1:-1;
        var zPos=lane===0?-1.5:-4.5;
        carMesh.rotation.y=dir===1?Math.PI/2:-Math.PI/2;
        carMesh.position.set(pt.x,0.05,zPos);
        scene.add(carMesh);
        var speed=0.06+Math.random()*0.08;
        streetCars.push({mesh:carMesh,dir:dir,speed:speed,lane:lane});
      }
    }
  });

  // ===== CAMERA DRAG CONTROLS =====
  var isDragging=false,prevMX=0,prevMY=0;
  var camTheta=0,camPhi=0.5;
  var camTarget=new THREE.Vector3(0,2,-3);
  var camRadius=26;

  function updateCamera(){
    camera.position.x=camTarget.x+camRadius*Math.sin(camTheta)*Math.cos(camPhi);
    camera.position.y=camTarget.y+camRadius*Math.sin(camPhi);
    camera.position.z=camTarget.z+camRadius*Math.cos(camTheta)*Math.cos(camPhi);
    camera.lookAt(camTarget);
  }

  renderer.domElement.addEventListener('mousedown',function(e){isDragging=false;prevMX=e.clientX;prevMY=e.clientY;});
  renderer.domElement.addEventListener('mousemove',function(e){
    if(e.buttons!==1)return;
    var dx=e.clientX-prevMX,dy=e.clientY-prevMY;
    if(Math.abs(dx)>2||Math.abs(dy)>2)isDragging=true;
    camTheta-=dx*0.005;
    camPhi=Math.max(0.15,Math.min(1.2,camPhi+dy*0.005));
    prevMX=e.clientX;prevMY=e.clientY;
    updateCamera();
  });
  renderer.domElement.addEventListener('wheel',function(e){
    camRadius=Math.max(12,Math.min(50,camRadius+e.deltaY*0.03));
    updateCamera();
  });

  // Touch support
  var touchStartX=0,touchStartY=0;
  renderer.domElement.addEventListener('touchstart',function(e){
    if(e.touches.length===1){touchStartX=e.touches[0].clientX;touchStartY=e.touches[0].clientY;isDragging=false;}
  },{passive:true});
  renderer.domElement.addEventListener('touchmove',function(e){
    if(e.touches.length===1){
      var dx=e.touches[0].clientX-touchStartX,dy=e.touches[0].clientY-touchStartY;
      if(Math.abs(dx)>2||Math.abs(dy)>2)isDragging=true;
      camTheta-=dx*0.005;
      camPhi=Math.max(0.15,Math.min(1.2,camPhi+dy*0.005));
      touchStartX=e.touches[0].clientX;touchStartY=e.touches[0].clientY;
      updateCamera();
    }
  },{passive:true});

  // ===== ANIMATION LOOP =====
  var clock=new THREE.Clock();
  var blinkTimer=0,blinkState=true;
  var autoRotate=true,autoTimer=0;

  function animateStreet3D(){
    requestAnimationFrame(animateStreet3D);
    var delta=clock.getDelta();

    // Traffic light blink
    blinkTimer+=delta;
    if(blinkTimer>1.2){
      blinkState=!blinkState;blinkTimer=0;
      redLight.material.color.setHex(blinkState?0xff2222:0x661111);
    }

    // Auto-rotate camera gently when not dragging
    if(!isDragging){
      autoTimer+=delta;
      camTheta+=delta*0.03;
      updateCamera();
    }

    // Update cars
    for(var i=streetCars.length-1;i>=0;i--){
      var car=streetCars[i];
      car.mesh.position.x+=car.speed*car.dir*60*delta;
      // Slight wheel spin effect via mesh children
      if(car.mesh.position.x>40||car.mesh.position.x<-40){
        scene.remove(car.mesh);
        streetCars.splice(i,1);
      }
    }

    // Random car spawn
    if(Math.random()<0.003&&streetCars.length<8){
      spawnCar(Math.random()>0.5?0:1);
    }

    // Person idle animation (subtle bob)
    personGroup.position.y=0.1+Math.sin(autoTimer*2)*0.05;

    renderer.render(scene,camera);
  }
  animateStreet3D();

  // Resize handler
  window.addEventListener('resize',function(){
    var nw=container.clientWidth,nh=container.clientHeight;
    camera.aspect=nw/nh;camera.updateProjectionMatrix();
    renderer.setSize(nw,nh);
  });
}

function drawContactArt(){
  const c=document.getElementById('contactPixelArt');if(!c)return;
  const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
  ctx.fillStyle='#3a3a3a';ctx.fillRect(0,0,180,200);
  ctx.fillStyle='#8b7355';ctx.fillRect(30,110,120,10);ctx.fillStyle='#7a6245';ctx.fillRect(40,120,10,50);ctx.fillRect(130,120,10,50);
  ctx.fillStyle='#555';ctx.fillRect(55,60,70,52);ctx.fillStyle='#333';ctx.fillRect(58,63,64,46);
  ctx.fillStyle='#2a4a2a';ctx.fillRect(60,65,60,42);ctx.fillStyle='#7ec8e3';ctx.font='8px "Silkscreen",monospace';
  ctx.fillText('> hello',64,78);ctx.fillText('> world',64,90);ctx.fillStyle='#88cc88';ctx.fillText('> _',64,102);
  ctx.fillStyle='#555';ctx.fillRect(82,112,16,6);ctx.fillStyle='#666';ctx.fillRect(60,122,60,8);
  ctx.fillStyle='#777';for(let i=0;i<8;i++)ctx.fillRect(63+i*7,124,5,4);
  ctx.fillStyle='#aaa';ctx.fillRect(140,100,14,14);ctx.fillStyle='#6a3a1a';ctx.fillRect(142,98,10,4);
  ctx.fillStyle='#88888844';ctx.fillRect(145,90,2,6);ctx.fillRect(149,88,2,6);
  ctx.fillStyle='#5a3a1a';ctx.fillRect(20,100,12,14);ctx.fillStyle='#3a8a3a';ctx.fillRect(22,88,8,14);
  ctx.fillStyle='#4a9a4a';ctx.fillRect(18,82,6,10);ctx.fillRect(28,80,6,12);
  ctx.fillStyle='#ddd';ctx.fillRect(62,145,56,36);ctx.fillStyle='#bbb';
  ctx.beginPath();ctx.moveTo(62,145);ctx.lineTo(90,165);ctx.lineTo(118,145);ctx.fill();
  ctx.fillStyle='#c0392b';ctx.fillRect(85,155,10,3);
}

// ===== INIT =====
window.addEventListener('DOMContentLoaded',()=>{
  drawMainCharacter();drawServerIcon();drawAvatar();init3DBuilding();initStreetScene3D();

  // Hash routing
  navigateTo(window.location.hash.replace('#','')||'about');
});
