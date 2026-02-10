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

function drawBuildingScene(){
  const c=document.getElementById('buildingCanvas'),ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
  ctx.fillStyle='#4a4a4a';ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle='#b8a898';ctx.fillRect(20,40,240,340);ctx.fillStyle='#a09080';ctx.fillRect(260,40,180,340);
  ctx.fillStyle='#c0b0a0';ctx.beginPath();ctx.moveTo(20,40);ctx.lineTo(140,0);ctx.lineTo(440,0);ctx.lineTo(440,40);ctx.fill();
  ctx.fillStyle='#d0c0b0';ctx.beginPath();ctx.moveTo(140,0);ctx.lineTo(260,40);ctx.lineTo(440,40);ctx.lineTo(440,0);ctx.fill();
  ctx.fillStyle='#2244aa';ctx.fillRect(40,70,200,80);ctx.fillStyle='#3355cc';ctx.fillRect(42,72,196,76);
  ctx.fillStyle='#fff';ctx.font='bold 22px "Silkscreen",monospace';ctx.fillText('MAC',60,102);
  ctx.font='bold 18px "Silkscreen",monospace';ctx.fillText('PARKING',56,126);
  ctx.fillStyle='#2244aa';ctx.fillRect(60,160,80,60);ctx.fillStyle='#3355cc';ctx.fillRect(62,162,76,56);
  ctx.fillStyle='#fff';ctx.font='bold 36px "Silkscreen",monospace';ctx.fillText('P5',72,204);
  for(let r=0;r<3;r++)for(let c2=0;c2<2;c2++){const wx=170+c2*42,wy=160+r*55;
    ctx.fillStyle='#667';ctx.fillRect(wx,wy,32,40);ctx.fillStyle='#557';ctx.fillRect(wx+2,wy+2,28,36);
    ctx.fillStyle='#889';ctx.fillRect(wx+14,wy,4,40);ctx.fillRect(wx,wy+18,32,4);}
  for(let r=0;r<3;r++)for(let c2=0;c2<3;c2++){const wx=280+c2*52,wy=60+r*55;
    ctx.fillStyle='#667';ctx.fillRect(wx,wy,36,40);ctx.fillStyle='#557';ctx.fillRect(wx+2,wy+2,32,36);
    ctx.fillStyle='#889';ctx.fillRect(wx+16,wy,4,40);ctx.fillRect(wx,wy+18,36,4);}
  ctx.fillStyle='#555';ctx.fillRect(40,310,80,70);ctx.fillStyle='#444';for(let i=0;i<7;i++)ctx.fillRect(42,312+i*10,76,1);
  ctx.fillStyle='#555';ctx.fillRect(140,310,80,70);ctx.fillStyle='#444';for(let i=0;i<7;i++)ctx.fillRect(142,312+i*10,76,1);
  ctx.fillStyle='#555';ctx.fillRect(310,280,50,100);ctx.fillStyle='#777';ctx.fillRect(242,350,14,20);
  ctx.fillStyle='#888';ctx.fillRect(240,348,18,4);ctx.fillStyle='#808080';ctx.fillRect(0,380,520,40);
  ctx.fillStyle='#666';ctx.fillRect(0,418,520,6);
  ctx.fillStyle='#aa3333';ctx.fillRect(280,5,120,30);ctx.fillStyle='#cc4444';ctx.fillRect(282,7,116,26);
  ctx.fillStyle='#fff';ctx.font='14px "Silkscreen",monospace';ctx.fillText('BAR',318,26);
  ctx.fillStyle='#999';ctx.fillRect(235,40,4,340);ctx.fillStyle='#666';ctx.fillRect(480,300,4,82);
  ctx.fillStyle='#888';ctx.fillRect(472,296,20,8);
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
  drawMainCharacter();drawServerIcon();drawAvatar();drawBuildingScene();drawStreetScene();

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

  // Neon flicker
  const bc=document.getElementById('buildingCanvas'),bctx=bc.getContext('2d');
  setInterval(()=>{const f=Math.random()>0.1;bctx.fillStyle=f?'#3355cc':'#2a44bb';bctx.fillRect(42,72,196,76);
    bctx.fillStyle='#fff';bctx.font='bold 22px "Silkscreen",monospace';bctx.fillText('MAC',60,102);
    bctx.font='bold 18px "Silkscreen",monospace';bctx.fillText('PARKING',56,126);},3000);

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
