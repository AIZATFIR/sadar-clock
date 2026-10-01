// Sadar Clock — Core Logic
// Focus on direct awareness and intentionality

const CYCLES = {
  deep_work: { name: 'Deep Work', desc: 'The ONE Thing', color: '#e5c07b', start: 8, end: 12 },
  intentional_rest: { name: 'Intentional Rest', desc: 'Embrace silence', color: '#56b6c2', start: 12, end: 13 },
  active_rest: { name: 'Active Rest', desc: 'Tubuh & gerak', color: '#98c379', start: 13, end: 15 },
  satisfying_reward: { name: 'Satisfying Reward', desc: 'Tanpa rasa bersalah', color: '#61afef', start: 15, end: 17 },
  wind_down: { name: 'Wind Down', desc: 'Refleksi & hening', color: '#c678dd', start: 20, end: 22 },
  sleep: { name: 'Sleep', desc: 'Reset siklus 90m', color: '#abb2bf', start: 22, end: 5 }
};

let currentCycleKey = 'deep_work';

function updateClock() {
  const now = new Date();
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const secDeg = (seconds / 60) * 360;
  const minDeg = (minutes / 60) * 360;
  const hourDeg = (hours / 12) * 360;

  const hourHand = document.getElementById('hour-hand');
  const minuteHand = document.getElementById('minute-hand');
  const secondHand = document.getElementById('second-hand');

  if (hourHand) hourHand.setAttribute('transform', `rotate(${hourDeg} 200 200)`);
  if (minuteHand) minuteHand.setAttribute('transform', `rotate(${minDeg} 200 200)`);
  if (secondHand) secondHand.setAttribute('transform', `rotate(${secDeg} 200 200)`);

  const digital = document.getElementById('digital-clock');
  if (digital) {
    const pad = (n) => String(n).padStart(2, '0');
    digital.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  const dateLabel = document.getElementById('date-label');
  if (dateLabel) {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    dateLabel.textContent = now.toLocaleDateString('id-ID', options);
  }

  requestAnimationFrame(updateClock);
}

function initDial() {
  const dialMarkers = document.getElementById('dial-markers');
  if (!dialMarkers) return;

  for (let i = 0; i < 12; i++) {
    const angle = (i * 30) * (Math.PI / 180);
    const isMajor = i % 3 === 0;
    const r1 = 175;
    const r2 = isMajor ? 160 : 167;

    const x1 = 200 + r1 * Math.cos(angle);
    const y1 = 200 + r1 * Math.sin(angle);
    const x2 = 200 + r2 * Math.cos(angle);
    const y2 = 200 + r2 * Math.sin(angle);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', isMajor ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)');
    line.setAttribute('stroke-width', isMajor ? '2' : '1');
    dialMarkers.appendChild(line);
  }
}

// Intention / Focus logic
function setupFocus() {
  const input = document.getElementById('current-focus');
  const saveBtn = document.getElementById('save-focus-btn');
  const display = document.getElementById('focus-display');
  const text = document.getElementById('focus-text');
  const clearBtn = document.getElementById('clear-focus');
  const inputWrap = document.querySelector('.focus-input-wrap');

  const saved = localStorage.getItem('sadar_focus');
  if (saved) {
    text.textContent = saved;
    display.style.display = 'flex';
    inputWrap.style.display = 'none';
  }

  function commitFocus() {
    const val = input.value.trim();
    if (!val) return;
    localStorage.setItem('sadar_focus', val);
    text.textContent = val;
    display.style.display = 'flex';
    inputWrap.style.display = 'none';
    input.value = '';
  }

  saveBtn.addEventListener('click', commitFocus);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') commitFocus();
  });

  clearBtn.addEventListener('click', () => {
    localStorage.removeItem('sadar_focus');
    display.style.display = 'none';
    inputWrap.style.display = 'block';
    input.focus();
  });
}

// Cycle switching
function setupCycles() {
  const pills = document.querySelectorAll('.cycle-pill');
  const label = document.getElementById('cycle-label');

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      const cycleKey = pill.getAttribute('data-cycle');
      if (CYCLES[cycleKey]) {
        label.textContent = CYCLES[cycleKey].name;
        document.documentElement.style.setProperty('--accent-gold', CYCLES[cycleKey].color);
      }
    });
  });
}

// Breathing animation guide text
function setupBreathing() {
  const guide = document.getElementById('breathe-guide');
  const texts = [
    'Tarik nafas... (Sadar hadir)',
    'Tahan sejenak... (Hening)',
    'Hembuskan perlahan... (Lepaskan beban)',
    'Kembali ke momen ini...'
  ];
  let step = 0;
  setInterval(() => {
    step = (step + 1) % texts.length;
    guide.style.opacity = '0';
    setTimeout(() => {
      guide.textContent = texts[step];
      guide.style.opacity = '1';
    }, 400);
  }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
  initDial();
  setupFocus();
  setupCycles();
  setupBreathing();
  requestAnimationFrame(updateClock);
});
