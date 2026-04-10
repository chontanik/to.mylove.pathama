// ======== Navigation & Simple Logic ========

function goToPage(pageId) {
  // Hide all sections
  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.add('hidden');
    section.classList.remove('flex'); // Add flex back when shown if needed, but we use flex inside main instead. 
    // Wait, the sections themselves just need hidden removed and they will display as blocks containing the flex main.
  });
  
  // Show target section
  const target = document.getElementById(pageId);
  if(target) {
    target.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Hide modal if it's open
  document.getElementById('alert-modal').classList.add('hidden');
  document.getElementById('alert-modal').classList.remove('flex');
}

// "No" button opens modal
const btnNo = document.getElementById('btn-no');
if(btnNo) {
  btnNo.addEventListener('click', () => {
    const modal = document.getElementById('alert-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex'); // Need flex to center content
  });
}

// Details toggle on Page 2
const btnViewDetails = document.getElementById('btn-view-details');
if(btnViewDetails) {
  btnViewDetails.addEventListener('click', () => {
    const detailsBox = document.getElementById('details-box');
    if (detailsBox.classList.contains('hidden')) {
      detailsBox.classList.remove('hidden');
    } else {
      detailsBox.classList.add('hidden');
    }
  });
}


// ======== Particle Background Logic ========

// Config mimicking the Vue props
const particleConfig = {
  particleCount: 25,
  colors: ['#F4C0D1', '#ED93B1', '#D4537E', '#FBEAF0', '#f9d0e0'],
  minSize: 8,
  maxSize: 18,
  speed: 2,
  wind: 0.4,
  swayAmount: 1.2
};

const canvas = document.getElementById('particle-canvas');
const canvasWrapper = document.getElementById('particle-wrapper');
let ctx = canvas.getContext('2d');
let particles = [];
let animId = null;
let width = 0;
let height = 0;

class Petal {
  constructor(initial = false) {
    this.init(initial);
  }

  init(initial = false) {
    this.x = Math.random() * width;
    this.y = initial ? Math.random() * height : -20;
    this.size = particleConfig.minSize + Math.random() * (particleConfig.maxSize - particleConfig.minSize);
    this.color = particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)];
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.06;
    this.vy = particleConfig.speed * 0.6 + Math.random() * particleConfig.speed;
    this.vx = (Math.random() - 0.5) * particleConfig.wind;
    this.swayAngle = Math.random() * Math.PI * 2;
    this.swaySpeed = 0.01 + Math.random() * 0.02;
    this.alpha = 0.7 + Math.random() * 0.3;
    this.scaleY = 0.5 + Math.random() * 0.4;
  }

  update() {
    this.swayAngle += this.swaySpeed;
    this.x += this.vx + Math.sin(this.swayAngle) * particleConfig.swayAmount;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    if (this.y > height + 30) this.init(false);
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(1, this.scaleY);
    ctx.globalAlpha = this.alpha;

    const w = this.size;
    const h = this.size * 1.4;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.bezierCurveTo( w * 0.9, -h * 0.1,  w * 0.9,  h * 0.4, 0,  h / 2);
    ctx.bezierCurveTo(-w * 0.9,  h * 0.4, -w * 0.9, -h * 0.1, 0, -h / 2);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = this.alpha * 0.25;
    ctx.strokeStyle = darken(this.color);
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.globalAlpha = this.alpha * 0.2;
    ctx.strokeStyle = darken(this.color);
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.quadraticCurveTo(w * 0.1, 0, 0, h / 2);
    ctx.stroke();

    ctx.restore();
  }
}

function darken(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  const r = Math.max(0, (num >> 16) - 40);
  const g = Math.max(0, ((num >> 8) & 0xff) - 40);
  const b = Math.max(0, (num & 0xff) - 40);
  return `rgb(${r},${g},${b})`;
}

function initParticles() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  particles = Array.from({ length: particleConfig.particleCount }, () => new Petal(true));
}

function animateParticles() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => { p.update(); p.draw(); });
  animId = requestAnimationFrame(animateParticles);
}

function onResize() {
  cancelAnimationFrame(animId);
  initParticles();
  animateParticles();
}

// Start particles
initParticles();
animateParticles();
window.addEventListener('resize', onResize);
