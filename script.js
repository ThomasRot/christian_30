/* ==========================================================================
   HAAFEMEISTER.EXE — Chaos Engine
   ========================================================================== */

(() => {

/* ----------------------- CONFETTI CANVAS ----------------------- */
const canvas = document.getElementById('confetti-canvas');
const ctx    = canvas.getContext('2d');
let cw = canvas.width  = window.innerWidth;
let ch = canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  cw = canvas.width  = window.innerWidth;
  ch = canvas.height = window.innerHeight;
});

const confettiPieces = [];
const EMOJIS = ['🎉','🎊','🎂','🎈','🥳','✨','⭐','🎁','🍾','🏆','🚗','⛵','👔','💀'];
const COLORS = ['#ff0044','#00cc44','#ff8800','#00aaff','#ff00aa','#ffff00','#8800ff'];

function spawnConfetti(n = 80, x = null, y = null) {
  for (let i = 0; i < n; i++) {
    confettiPieces.push({
      x: x ?? Math.random() * cw,
      y: y ?? -20,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 4 + 3,
      size: Math.random() * 12 + 8,
      rot: Math.random() * Math.PI * 2,
      vr:  (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      emoji: Math.random() < 0.3 ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : null,
      life: 0,
      maxLife: 200 + Math.random() * 100,
    });
  }
}

function tickConfetti() {
  ctx.clearRect(0, 0, cw, ch);
  for (let i = confettiPieces.length - 1; i >= 0; i--) {
    const p = confettiPieces[i];
    p.vy += 0.08;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life++;
    if (p.y > ch + 30 || p.life > p.maxLife) {
      confettiPieces.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    if (p.emoji) {
      ctx.font = `${p.size * 1.5}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);
    } else {
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/3, p.size, p.size/2);
    }
    ctx.restore();
  }
  requestAnimationFrame(tickConfetti);
}
tickConfetti();

// Ambient confetti trickle
setInterval(() => spawnConfetti(4), 600);
// Initial burst
setTimeout(() => spawnConfetti(200), 500);

/* ----------------------- CLICK PARTICLES ----------------------- */
const PARTICLE_EMOJIS = ['🎉','🎊','🎂','🎈','🥳','✨','⭐','🎁','30!','🚗','⛵'];
document.addEventListener('click', (e) => {
  // Don't spam inside form fields (none, but just in case)
  if (e.target.closest('input, textarea')) return;

  const n = 10;
  for (let i = 0; i < n; i++) {
    const el = document.createElement('span');
    el.className = 'click-particle';
    el.textContent = PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)];
    el.style.left = (e.clientX - 15) + 'px';
    el.style.top  = (e.clientY - 15) + 'px';
    const angle = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.6;
    const dist  = 80 + Math.random() * 120;
    el.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    el.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1100);
  }

  // Confetti canvas puff
  spawnConfetti(12, e.clientX, e.clientY);
});

/* ----------------------- CURSOR TRAIL ----------------------- */
const TRAIL = ['🎉','✨','⭐','🎂','🥳','💫'];
let lastTrail = 0;
document.addEventListener('mousemove', (e) => {
  const now = performance.now();
  if (now - lastTrail < 90) return;
  lastTrail = now;
  const el = document.createElement('span');
  el.className = 'cursor-trail';
  el.textContent = TRAIL[Math.floor(Math.random() * TRAIL.length)];
  el.style.left = e.clientX + 'px';
  el.style.top  = e.clientY + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 700);
});

/* ----------------------- PARTY MODE ----------------------- */
const partyBtn = document.getElementById('party-mode');
let partyMode = false;
let partyInterval = null;
partyBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  partyMode = !partyMode;
  document.body.classList.toggle('party-mode', partyMode);
  partyBtn.textContent = partyMode ? '🎉 PARTY MODE: ON 🎉' : '🎉 PARTY MODE: OFF 🎉';
  if (partyMode) {
    partyInterval = setInterval(() => spawnConfetti(30), 250);
  } else {
    clearInterval(partyInterval);
  }
});

/* ----------------------- VISITOR COUNTER ----------------------- */
(function runCounter() {
  const el = document.getElementById('visitor-count');
  let base = parseInt(localStorage.getItem('haaf-visitors') || '666', 10);
  base += Math.floor(Math.random() * 3) + 1;
  localStorage.setItem('haaf-visitors', String(base));
  el.textContent = String(base).padStart(7, '0');
  // Slow fake traffic
  setInterval(() => {
    base += Math.floor(Math.random() * 2);
    el.textContent = String(base).padStart(7, '0');
  }, 4000);
})();

/* ----------------------- LIVE STATS ----------------------- */
(function updateStats() {
  const birth = new Date('1996-04-16T00:00:00'); // rough guess — change if known
  function tick() {
    const now = new Date();
    const diffMs = now - birth;
    const days = Math.floor(diffMs / 86_400_000);
    const hours = Math.floor(diffMs / 3_600_000);
    document.getElementById('stat-days').textContent  = days.toLocaleString('de-DE');
    document.getElementById('stat-hours').textContent = hours.toLocaleString('de-DE');
  }
  tick();
  setInterval(tick, 60_000);

  // Shirt counter keeps growing
  let shirts = 847;
  setInterval(() => {
    shirts++;
    document.getElementById('stat-hemden').textContent = shirts.toLocaleString('de-DE');
  }, 9000);

  // BMW count shuffles between ∞ and stupidly high number
  const bmwEl = document.getElementById('stat-bmw');
  setInterval(() => {
    bmwEl.textContent = Math.random() < 0.4 ? '∞' : (Math.floor(Math.random() * 9000) + 1000).toLocaleString('de-DE');
  }, 2500);

  // Wohnung bleibt bei 0
  const wohn = document.getElementById('stat-wohnung');
  setInterval(() => {
    wohn.textContent = Math.random() < 0.1 ? '0,01€' : '0,00€';
  }, 3000);
})();

/* ----------------------- ACHIEVEMENT UNLOCK ----------------------- */
document.querySelectorAll('.achievement-list li').forEach(li => {
  li.addEventListener('click', () => {
    spawnConfetti(40, window.innerWidth / 2, 200);
    li.style.background = 'linear-gradient(90deg, #0f0, #0ff, #0f0)';
  });
});

/* ----------------------- GIFT REVEAL ----------------------- */
const giftBox = document.getElementById('gift-box');
const giftReveal = document.getElementById('gift-reveal');
giftBox.addEventListener('click', (e) => {
  e.stopPropagation();
  giftBox.classList.add('opened');
  giftBox.style.display = 'none';
  giftReveal.classList.add('show');
  spawnConfetti(300);
});

/* ----------------------- BIG BUTTON ----------------------- */
const bigBtn = document.getElementById('big-button');
const bigCounter = document.getElementById('button-counter');
const bigMessages = [
  "Hab ich doch gesagt: NICHT drücken!",
  "Okay, offensichtlich willst du das.",
  "Ernsthaft?",
  "Christian würde das auch drücken.",
  "Solche Menschen mag ich 👌",
  "Noch mal? Gerne.",
  "BMW M3 freischalten in… ca. 40.000€",
];
const EXPLODE_AT = 15;
const warnings = {
  10: '⚠️ NOCH 5 KLICKS UND DIE SEITE EXPLODIERT ⚠️',
  11: '⚠️ Noch 4… ⚠️',
  12: '⚠️ 3… ⚠️',
  13: '⚠️ 2… LETZTE WARNUNG ⚠️',
  14: '💣 1… DU HAST ES SO GEWOLLT 💣',
};
let pressCount = 0;
let exploded = false;
bigBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (exploded) return;
  pressCount++;

  if (pressCount >= EXPLODE_AT) {
    exploded = true;
    explodeThePage();
    return;
  }

  if (warnings[pressCount]) {
    bigCounter.textContent = warnings[pressCount];
    bigCounter.style.color = '#f00';
    bigCounter.style.fontSize = (18 + (pressCount - 9) * 4) + 'px';
  } else {
    const msg = bigMessages[Math.min(pressCount - 1, bigMessages.length - 1)];
    bigCounter.textContent = pressCount >= bigMessages.length
      ? `Drücken #${pressCount}`
      : (msg.endsWith('#') ? msg + pressCount : msg);
  }

  // Grow it
  const scale = 1 + pressCount * 0.01 * pressCount;
  bigBtn.style.transform = `scale(${scale})`;
});

function explodeThePage() {
  // 1. White flash
  const flash = document.createElement('div');
  flash.className = 'explosion-flash';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 800);

  // 2. KABOOM text overlay
  const boom = document.createElement('div');
  boom.className = 'kaboom';
  boom.textContent = '💥 KABOOM 💥';
  document.body.appendChild(boom);
  setTimeout(() => boom.remove(), 2200);

  // 3. Violent screen shake
  document.body.classList.add('exploding');

  // 4. MASSIVE confetti barrage (respect perf budget on low-end)
  spawnConfetti(600);
  setTimeout(() => spawnConfetti(300), 200);
  setTimeout(() => spawnConfetti(300), 500);

  // 5. All structural elements fly away in random directions
  const flyers = document.querySelectorAll(
    '.section-card, .hero, .footer, .top-marquee, .visitor-counter, .construction'
  );
  flyers.forEach(el => {
    const angle = Math.random() * Math.PI * 2;
    const dist  = 1500 + Math.random() * 800;
    el.style.setProperty('--fx',    Math.cos(angle) * dist + 'px');
    el.style.setProperty('--fy',    Math.sin(angle) * dist - 300 + 'px');
    el.style.setProperty('--frot',  (Math.random() * 1440 - 720) + 'deg');
    el.style.setProperty('--delay', (Math.random() * 0.35) + 's');
    el.classList.add('explode');
  });

  // 6. Hide the button itself (it's the detonator, after all)
  bigBtn.style.visibility = 'hidden';

  // 7. Aftermath screen after the smoke clears
  setTimeout(() => {
    document.body.classList.remove('exploding');
    const aftermath = document.createElement('div');
    aftermath.className = 'aftermath';
    aftermath.innerHTML = `
      <div class="aftermath-emoji">🪦💥🔥</div>
      <h1>DIE SEITE IST EXPLODIERT</h1>
      <p>Hab ich doch gesagt: NICHT DRÜCKEN.</p>
      <button class="reload-btn" onclick="location.reload()">🔄 NOCHMAL</button>
    `;
    document.body.appendChild(aftermath);
  }, 2400);
}

/* ----------------------- KONAMI CODE ----------------------- */
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let idx = 0;
document.addEventListener('keydown', (e) => {
  if (e.key === konami[idx]) {
    idx++;
    if (idx === konami.length) {
      idx = 0;
      document.body.classList.add('party-mode');
      partyMode = true;
      partyBtn.textContent = '🎉 PARTY MODE: ON 🎉';
      spawnConfetti(500);
    }
  } else {
    idx = 0;
  }
});

})();
