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
    var signBg = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0.15), M.white);
    signBg.position.set(-12, 2.5, 8.15); g.add(signBg);
    var aShape = new THREE.Shape();
    aShape.moveTo(0, 0); aShape.lineTo(0.4, 0.9); aShape.lineTo(0.8, 0);
    aShape.lineTo(0.65, 0); aShape.lineTo(0.4, 0.5); aShape.lineTo(0.15, 0); aShape.closePath();
    var aGeo = new THREE.ExtrudeGeometry(aShape, { depth: 0.06, bevelEnabled: false });
    var aMesh = new THREE.Mesh(aGeo, M.windowFrame);
    aMesh.position.set(-12.4, 2, 8.25); g.add(aMesh);
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

  // Flagpoles
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
      var flag = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1), p.flagMat);
      flag.position.set(p.x + 0.8, 11, p.z); flag.rotation.y = -0.1; g.add(flag);
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
    bldg.children.forEach(function(child) {
      if (child.children) {
        child.children.forEach(function(c) {
          if (c.geometry && c.geometry.type === 'PlaneGeometry' && c.position.y > 10) {
            c.rotation.y = Math.sin(Date.now() * 0.002 + c.position.x) * 0.15 - 0.1;
          }
        });
      }
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

function drawStreetScene(){
  const c=document.getElementById('streetCanvas'),ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
  ctx.fillStyle='#4a4a4a';ctx.fillRect(0,0,c.width,c.height);

  // === 3D PIXEL BUILDINGS ===
  // Building 1 (left, tall)
  ctx.fillStyle='#737373';ctx.fillRect(40,10,158,170);
  ctx.fillStyle='#606060';ctx.fillRect(198,14,10,166);
  ctx.fillStyle='#858585';ctx.fillRect(40,6,168,6);
  ctx.fillStyle='#7d7d7d';ctx.fillRect(40,70,158,3);ctx.fillRect(40,125,158,3);
  ctx.fillStyle='#555';ctx.fillRect(40,178,168,3);
  for(let r=0;r<3;r++)for(let c2=0;c2<4;c2++){
    const wx=52+c2*38,wy=18+r*55;
    ctx.fillStyle='#4a4a55';ctx.fillRect(wx-1,wy-1,28,38);
    ctx.fillStyle=(r===0&&c2===1)?'#8aa0bb':'#5a5a6a';ctx.fillRect(wx,wy,26,36);
    ctx.fillStyle='#666';ctx.fillRect(wx+12,wy,2,36);ctx.fillRect(wx,wy+17,26,2);
    ctx.fillStyle='#808080';ctx.fillRect(wx-1,wy+36,28,2);
  }
  ctx.fillStyle='#666';ctx.fillRect(110,0,2,10);ctx.fillStyle='#f33';ctx.fillRect(109,0,4,2);

  // Building 2 (center-left, shorter)
  ctx.fillStyle='#6b6b6b';ctx.fillRect(212,32,148,148);
  ctx.fillStyle='#5a5a5a';ctx.fillRect(360,36,10,144);
  ctx.fillStyle='#7b7b7b';ctx.fillRect(212,28,158,6);
  ctx.fillStyle='#737373';ctx.fillRect(212,90,148,3);ctx.fillRect(212,142,148,3);
  ctx.fillStyle='#505050';ctx.fillRect(212,178,158,3);
  for(let r=0;r<3;r++)for(let c2=0;c2<3;c2++){
    const wx=228+c2*46,wy=42+r*50;
    ctx.fillStyle='#4a4a55';ctx.fillRect(wx-1,wy-1,32,34);
    ctx.fillStyle='#5a5a6a';ctx.fillRect(wx,wy,30,32);
    ctx.fillStyle='#666';ctx.fillRect(wx+14,wy,2,32);ctx.fillRect(wx,wy+15,30,2);
    ctx.fillStyle='#808080';ctx.fillRect(wx-1,wy+32,32,2);
  }

  // Building 3 (center-right, medium)
  ctx.fillStyle='#707070';ctx.fillRect(374,18,182,162);
  ctx.fillStyle='#5c5c5c';ctx.fillRect(556,22,10,158);
  ctx.fillStyle='#828282';ctx.fillRect(374,14,192,6);
  ctx.fillStyle='#787878';ctx.fillRect(374,76,182,3);ctx.fillRect(374,130,182,3);
  ctx.fillStyle='#525252';ctx.fillRect(374,178,192,3);
  for(let r=0;r<3;r++)for(let c2=0;c2<4;c2++){
    const wx=388+c2*44,wy=28+r*54;
    ctx.fillStyle='#4a4a55';ctx.fillRect(wx-1,wy-1,30,36);
    ctx.fillStyle='#5a5a6a';ctx.fillRect(wx,wy,28,34);
    ctx.fillStyle='#666';ctx.fillRect(wx+13,wy,2,34);ctx.fillRect(wx,wy+16,28,2);
    ctx.fillStyle='#808080';ctx.fillRect(wx-1,wy+34,30,2);
  }

  // Building 4 (right, tallest)
  ctx.fillStyle='#6e6e6e';ctx.fillRect(570,5,252,175);
  ctx.fillStyle='#5a5a5a';ctx.fillRect(822,10,10,170);
  ctx.fillStyle='#808080';ctx.fillRect(570,1,262,6);
  ctx.fillStyle='#767676';ctx.fillRect(570,60,252,3);ctx.fillRect(570,115,252,3);
  ctx.fillStyle='#4e4e4e';ctx.fillRect(570,178,262,3);
  for(let r=0;r<3;r++)for(let c2=0;c2<5;c2++){
    const wx=584+c2*48,wy=14+r*55;
    ctx.fillStyle='#4a4a55';ctx.fillRect(wx-1,wy-1,34,38);
    ctx.fillStyle='#5a5a6a';ctx.fillRect(wx,wy,32,36);
    ctx.fillStyle='#666';ctx.fillRect(wx+15,wy,2,36);ctx.fillRect(wx,wy+17,32,2);
    ctx.fillStyle='#808080';ctx.fillRect(wx-1,wy+36,34,2);
  }
  ctx.fillStyle='#777';ctx.fillRect(780,0,30,5);ctx.fillStyle='#999';ctx.fillRect(782,1,26,3);

  // === SIDEWALK & ROAD ===
  ctx.fillStyle='#808080';ctx.fillRect(0,170,1560,30);
  ctx.fillStyle='#505050';ctx.fillRect(0,200,1560,240);
  // Crosswalk - clean vertical stripes
  ctx.fillStyle='#c8b860';
  for(let i=0;i<7;i++){ctx.fillRect(586+i*20,204,12,230);}
  // Center dashed line
  ctx.fillStyle='#c8b860';for(let i=0;i<20;i++)ctx.fillRect(i*80+20,316,50,4);
  drawArrow(ctx,860,280);drawArrow(ctx,1100,340);
  // Traffic light
  ctx.fillStyle='#555';ctx.fillRect(650,50,6,155);ctx.fillStyle='#666';ctx.fillRect(636,46,34,8);
  ctx.fillStyle='#884444';ctx.fillRect(645,38,8,10);ctx.fillStyle='#cc3333';ctx.fillRect(647,40,4,4);
  drawStreetCharacter(ctx,660,135);ctx.fillStyle='#707070';ctx.fillRect(0,196,1560,6);
}

function drawArrow(ctx,x,y){ctx.fillStyle='#c8b860';ctx.fillRect(x,y,8,40);ctx.beginPath();ctx.moveTo(x-12,y);ctx.lineTo(x+4,y-20);ctx.lineTo(x+20,y);ctx.fill();}

function drawStreetCharacter(ctx,x,y){
  const s=3;ctx.fillStyle='#d4a574';ctx.fillRect(x,y,4*s,4*s);ctx.fillStyle='#5a3a1a';ctx.fillRect(x,y,4*s,1.5*s);
  ctx.fillStyle='#222';ctx.fillRect(x+1*s,y+2*s,s,s);ctx.fillRect(x+2.5*s,y+2*s,s,s);
  ctx.fillStyle='#4466aa';ctx.fillRect(x-0.5*s,y+4*s,5*s,5*s);ctx.fillStyle='#333';ctx.fillRect(x,y+9*s,2*s,3*s);ctx.fillRect(x+2.5*s,y+9*s,2*s,3*s);
  ctx.fillStyle='#222';ctx.fillRect(x-0.5*s,y+12*s,2.5*s,s);ctx.fillRect(x+2.5*s,y+12*s,2.5*s,s);
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

// ===== CAR ANIMATION SYSTEM =====
const activeCars=[];
const carColors=['#cc3333','#3366cc','#33aa55','#ccaa33','#cc6633'];

function drawAnimatedCar(ctx,car){
  const {x,y,color,dir}=car;
  ctx.save();
  if(dir<0){ctx.translate(x+40,0);ctx.scale(-1,1);ctx.translate(-(x+40),0);}
  ctx.fillStyle=color;ctx.fillRect(x,y,80,24);ctx.fillRect(x+16,y-14,44,16);
  ctx.fillStyle='#aaccee';ctx.fillRect(x+20,y-12,16,12);ctx.fillRect(x+40,y-12,16,12);
  ctx.fillStyle='#222';ctx.fillRect(x+8,y+22,16,8);ctx.fillRect(x+56,y+22,16,8);
  ctx.fillStyle='#888';ctx.fillRect(x+12,y+24,8,4);ctx.fillRect(x+60,y+24,8,4);
  ctx.fillStyle='#ffee88';ctx.fillRect(x+76,y+4,6,6);ctx.fillStyle='#ff3333';ctx.fillRect(x-2,y+4,4,6);
  ctx.restore();
}

// ===== INIT =====
window.addEventListener('DOMContentLoaded',()=>{
  drawMainCharacter();drawServerIcon();drawAvatar();init3DBuilding();drawStreetScene();

  const sc=document.getElementById('streetCanvas'),sctx=sc.getContext('2d');
  // Save background for animation restore (hardware-accelerated via drawImage)
  const bgCanvas=document.createElement('canvas');
  bgCanvas.width=sc.width;bgCanvas.height=sc.height;
  bgCanvas.getContext('2d').drawImage(sc,0,0);

  // Animation loop: cars + traffic light
  let lastBlink=0,blinkOn=true;
  function animateStreet(ts){
    sctx.drawImage(bgCanvas,0,0);
    // Traffic light blink
    if(ts-lastBlink>1000){blinkOn=!blinkOn;lastBlink=ts;}
    sctx.fillStyle=blinkOn?'#ff3333':'#883333';sctx.fillRect(647,40,4,4);
    // Update and draw cars
    for(let i=activeCars.length-1;i>=0;i--){
      const car=activeCars[i];
      car.x+=car.speed*car.dir;
      if(car.x>1620||car.x<-120){activeCars.splice(i,1);continue;}
      drawAnimatedCar(sctx,car);
    }
    requestAnimationFrame(animateStreet);
  }
  requestAnimationFrame(animateStreet);

  // Click to spawn moving cars (upper lane=right, lower lane=left)
  sc.addEventListener('click',e=>{const r=sc.getBoundingClientRect();
    const x=(e.clientX-r.left)*(sc.width/r.width),y=(e.clientY-r.top)*(sc.height/r.height);
    if(y>200&&y<420){
      const dir=y<316?1:-1;
      const color=carColors[Math.floor(Math.random()*carColors.length)];
      const speed=1.5+Math.random()*2;
      activeCars.push({x:x-40,y:y-15,color,dir,speed});
    }});

  // Hash routing
  navigateTo(window.location.hash.replace('#','')||'about');
});
