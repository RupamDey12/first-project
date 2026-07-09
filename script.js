/* Setup & Theme */
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', savedTheme);
themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', current);
  localStorage.setItem('theme', current);
});

/* Side Navigation Logic */
const logoBtn = document.getElementById('logoBtn');
const sideNav = document.getElementById('sideNav');
const closeNav = document.getElementById('closeNav');
const navOverlay = document.getElementById('navOverlay');
const navItems = document.querySelectorAll('.nav-item');

function toggleNav() {
    sideNav.classList.toggle('active');
    navOverlay.classList.toggle('active');
}
logoBtn.addEventListener('click', toggleNav);
closeNav.addEventListener('click', toggleNav);
navOverlay.addEventListener('click', toggleNav);
navItems.forEach(item => {
    item.addEventListener('click', () => {
        toggleNav();
    });
});

/* Sound Design */
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function initAudio() { if (!audioCtx) { audioCtx = new AudioContext(); } if (audioCtx.state === 'suspended') { audioCtx.resume(); } }
function playTickSound() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, audioCtx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.start(); osc.stop(audioCtx.currentTime + 0.05);
}
document.body.addEventListener('click', initAudio, { once: true });
document.body.addEventListener('mousemove', initAudio, { once: true });

/* ----------------------------------------------------
   TOP TERMINAL LOGIC: Pure Typewriter Effect
   ---------------------------------------------------- */
const messages = [
  "console.log('Hello! I build web & ML projects.')",
  "console.log('Fetching live GitHub data...')",
  "console.log('Open to collaborate ✨')"
];
let mi=0, pi=0, del=false;
const typeEl = document.getElementById('typeText');
const blinkEl = document.getElementById('blink');

function typeTick() {
  const cur = messages[mi];
  if(!del){ 
      pi++; 
      typeEl.textContent = cur.slice(0,pi); 
      if(pi===cur.length){ 
          del=true; 
          setTimeout(typeTick, 2000); 
          return; 
      } 
  }
  else { 
      pi--; 
      typeEl.textContent = cur.slice(0,pi); 
      if(pi===0){ 
          del=false; 
          mi = (mi + 1) % messages.length; 
      } 
  }
  setTimeout(typeTick, del?40:80);
}
setTimeout(typeTick, 500);

setInterval(()=>{
    if(blinkEl) {
        blinkEl.style.visibility = (blinkEl.style.visibility === 'hidden') ? 'visible' : 'hidden';
    }
},600);


/* ----------------------------------------------------
   BOTTOM TERMINAL LOGIC: Dedicated Command Line
   ---------------------------------------------------- */
const bottomTermInput = document.getElementById('bottomTermInput');
const bottomTermHistory = document.getElementById('bottomTermHistory');

bottomTermInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const cmd = bottomTermInput.value.trim().toLowerCase();
        
        const echoLine = document.createElement('div');
        echoLine.innerHTML = `<span class="term-prompt">guest@rupam:~$</span> ${cmd}`;
        bottomTermHistory.appendChild(echoLine);
        
        const responseLine = document.createElement('div');
        switch(cmd) {
            case 'help': responseLine.textContent = "Available commands: help, skills, whoami, clear, fetch repos"; break;
            case 'skills': responseLine.textContent = "> Python, C/C++, HTML/CSS/JS, ML Algorithms"; break;
            case 'whoami': responseLine.textContent = "Rupam Dey - Full Stack Developer & CSE Student"; break;
            case 'fetch repos': responseLine.innerHTML = "Connecting to GitHub API...<br><span style='color:var(--accent)'>[OK] Projects updated successfully.</span>"; break;
            case 'clear': 
                bottomTermHistory.innerHTML = ""; 
                break;
            case '': break;
            default: responseLine.textContent = `Command not found: ${cmd}`;
        }
        
        if (cmd !== 'clear' && cmd !== '') bottomTermHistory.appendChild(responseLine);
        
        bottomTermInput.value = '';
        bottomTermHistory.scrollTop = bottomTermHistory.scrollHeight;
    }
});

/* ----------------------------------------------------
   🔄 LIVE GITHUB API FETCH LOGIC
   ---------------------------------------------------- */
async function fetchGitHubProjects() {
    const slider = document.getElementById('projectSlider');
    try {
        const response = await fetch('https://api.github.com/users/RupamDey12/repos?sort=updated&per_page=6');
        const repos = await response.json();
        
        slider.innerHTML = '';
        
        repos.forEach((repo, i) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            
            const desc = repo.description ? repo.description : 'A recent coding project from my GitHub.';
            
            slide.innerHTML = `
                <div class="card tilt hover-target" data-index="${i}" style="height: 100%; display: flex; flex-direction: column;">
                    <h4 title="${repo.name}">${repo.name}</h4>
                    <p style="flex-grow: 1;">${desc}</p>
                    <div style="margin-top:16px; display:flex; gap:10px;">
                        <a href="${repo.html_url}" target="_blank" class="btn hover-target" style="padding: 6px 12px; font-size: 13px; margin: 0;">View Code</a>
                        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="btn hover-target" style="padding: 6px 12px; font-size: 13px; margin: 0;">Live Site</a>` : ''}
                    </div>
                </div>
            `;
            slider.appendChild(slide);
        });

        document.querySelectorAll('.card.tilt').forEach(n => applyTilt(n, 6));
        
        document.querySelectorAll('.hover-target, a, button, .btn, .card').forEach(el=>{
            el.addEventListener('mouseenter', ()=>{ cursor.style.transform='translate(-50%,-50%) scale(1.6)'; playTickSound(); });
            el.addEventListener('mouseleave', ()=>{ cursor.style.transform='translate(-50%,-50%) scale(1)'; });
        });

    } catch (error) {
        slider.innerHTML = '<div style="padding: 20px; color: #ff4a4a;">Failed to load projects. Please visit my GitHub directly!</div>';
        console.error('Error fetching GitHub repos:', error);
    }
}
fetchGitHubProjects();

/* Sorting Visualizer */
const algoContainer = document.getElementById('algoContainer');
let bars = [];
const numBars = 15;
function initAlgo() {
    algoContainer.innerHTML = ''; bars = [];
    for (let i = 0; i < numBars; i++) {
        let val = Math.floor(Math.random() * 50) + 10;
        let bar = document.createElement('div'); bar.classList.add('algo-bar');
        bar.style.height = `${val}px`; algoContainer.appendChild(bar);
        bars.push({ el: bar, val: val });
    }
}
async function bubbleSort() {
    for (let i = 0; i < bars.length; i++) {
        for (let j = 0; j < bars.length - i - 1; j++) {
            bars[j].el.style.background = 'var(--accent)'; bars[j+1].el.style.background = 'var(--accent)';
            await new Promise(r => setTimeout(r, 100));
            if (bars[j].val > bars[j+1].val) {
                let temp = bars[j].val; bars[j].val = bars[j+1].val; bars[j+1].val = temp;
                bars[j].el.style.height = `${bars[j].val}px`; bars[j+1].el.style.height = `${bars[j+1].val}px`;
            }
            bars[j].el.style.background = 'var(--muted)'; bars[j+1].el.style.background = 'var(--muted)';
        }
        bars[bars.length - 1 - i].el.style.background = 'var(--accent)';
    }
    setTimeout(() => { initAlgo(); bubbleSort(); }, 2000);
}
initAlgo(); bubbleSort();

/* Background Particles */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth, H = canvas.height = innerHeight;
let particles = [];
function rand(min,max){return Math.random()*(max-min)+min}
function createParticles(){
  particles = []; const count = Math.max(40, Math.floor((W*H)/120000));
  for(let i=0;i<count;i++) particles.push({x:rand(0,W), y:rand(0,H), r:rand(0.6,2.2), vx:rand(-0.3,0.3), vy:rand(-0.15,0.4), life:rand(600,1200)});
}
function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; createParticles(); }
addEventListener('resize', resize);
function drawBg(){
  ctx.clearRect(0,0,W,H);
  const g=ctx.createRadialGradient(W*0.7,H*0.2,10,W*0.5,H*0.5,Math.max(W,H));
  g.addColorStop(0,'rgba(0,234,255,0.03)'); g.addColorStop(1,'transparent');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  for(let p of particles){
    p.x += p.vx; p.y += p.vy; p.life--;
    if(p.x < -20 || p.x > W+20 || p.y < -20 || p.y > H+20 || p.life < 0){ p.x = rand(0,W); p.y = -10; p.life = rand(600,1200); }
    ctx.beginPath(); ctx.fillStyle = 'rgba(0,234,255,0.06)'; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
  }
  requestAnimationFrame(drawBg);
}
resize(); drawBg();

/* 3D Tilt function helper */
function applyTilt(el, strength=12){
  el.addEventListener('mousemove', e=>{
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width/2)) / (r.width/2);
    const dy = (e.clientY - (r.top + r.height/2)) / (r.height/2);
    el.style.transform = `rotateY(${dx*strength}deg) rotateX(${dy*-strength}deg) scale(1.02)`;
    el.style.boxShadow = `0 20px 40px rgba(0,0,0,0.45), 0 0 32px rgba(0,234,255,0.06)`;
  });
  el.addEventListener('mouseleave', ()=>{ el.style.transform=''; el.style.boxShadow=''; });
}

/* Interactions */
const cursor = document.getElementById('customCursor');
document.addEventListener('mousemove', e=>{ cursor.style.left=e.clientX+'px'; cursor.style.top=e.clientY+'px'; });
document.querySelectorAll('.hover-target, a, button, .btn, .icon-btn, .card').forEach(el=>{
  el.addEventListener('mouseenter', ()=>{ cursor.style.transform='translate(-50%,-50%) scale(1.6)'; playTickSound(); });
  el.addEventListener('mouseleave', ()=>{ cursor.style.transform='translate(-50%,-50%) scale(1)'; });
});
document.querySelectorAll('.tilt').forEach(n=>applyTilt(n,8));

/* Utils */
window.addEventListener('scroll', ()=>{ document.getElementById('backTop').style.display = window.scrollY > 400 ? 'block' : 'none'; });
document.getElementById('backTop').addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
document.getElementById('year').textContent = new Date().getFullYear();
function scrollToSection(sel){ document.querySelector(sel).scrollIntoView({behavior:'smooth'}); }
