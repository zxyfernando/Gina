/* ===============================
   script.js - ajuste del poster
   ===============================
   Objetivo:
   - Calcular las dimensiones exactas del poster (width / height) para llenar el viewport
     sin overflow ni scroll y manteniendo la proporción del póster.
   - Aplicar las dimensiones al elemento #poster.
   - Ajustar la fuente base opcionalmente si deseas que los textos escalen con la poster.
   - Añadir listener para resize para recalcular en cambio de orientación.
*/

/* CONFIGURACION BASE:
   Define aquí las dimensiones "base" del poster (en px).
   Estas deberían coincidir con el lienzo sobre el que diseñaste (proporción).
   En el CSS usamos 900x1400 como base. */
const POSTER_BASE_WIDTH = 900;
const POSTER_BASE_HEIGHT = 1400;
const poster = document.getElementById('poster');

/* Calcula y aplica dimensiones para que el poster Llene el viewport sin scroll
   y mantenga la proporción. */
function resizePoster() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const aspect = POSTER_BASE_WIDTH / POSTER_BASE_HEIGHT; // ancho / alto

  // Intenta usar el alto completo primero (para que siempre quepa verticalmente)
  let targetHeight = vh;
  let targetWidth = targetHeight * aspect;

  // Si el ancho resultante excede el viewport, en su lugar usamos el ancho máximo
  if (targetWidth > vw) {
    targetWidth = vw;
    targetHeight = targetWidth / aspect;
  }

  // Aplicar al poster
  poster.style.width = Math.round(targetWidth) + 'px';
  poster.style.height = Math.round(targetHeight) + 'px';

  // OPCIONAL: escalar root font-size para que textos en rem escalen con poster.
  // Calculamos la escala respecto al ancho base.
  const scale = targetWidth / POSTER_BASE_WIDTH;
  document.documentElement.style.fontSize = (16 * scale) + 'px'; // 16px base -> escalado
}

/* Ejecutar en carga y en resize/orientation change */
window.addEventListener('load', resizePoster);
window.addEventListener('resize', resizePoster);
window.addEventListener('orientationchange', () => setTimeout(resizePoster, 200));

/* NOTAS:
   - El poster queda siempre centrado y sin scroll (body overflow hidden en CSS).
   - Si quieres permitir scroll en móviles pequeños porque el poster no cabe, quita "overflow:hidden"
     del body en CSS y comenta la parte de JS que forza el ajuste; pero según lo solicitado se evita scroll.
*/

/* OPTIONAL: Si quieres ver un pequeño debug de las dimensiones en consola, descomenta: */
// window.addEventListener('load', () => {
//   console.log('Poster base:', POSTER_BASE_WIDTH, POSTER_BASE_HEIGHT);
//   console.log('Poster calculado:', poster.style.width, poster.style.height);
// });

/* ===============================
   ✨ EFECTO DE ESTRELLITAS DORADAS
   =============================== */

function createStar(x, y) {
  const star = document.createElement('span');
  star.className = 'star';
  star.style.left = `${x}px`;
  star.style.top = `${y}px`;
  star.style.setProperty('--rot', `${Math.random() * 360}deg`);
  document.body.appendChild(star);

  // Elimina la estrella después de 1 segundo
  setTimeout(() => star.remove(), 1000);
}

function handlePointerMove(e) {
  const x = e.clientX || (e.touches && e.touches[0].clientX);
  const y = e.clientY || (e.touches && e.touches[0].clientY);
  if (!x || !y) return;

  // Crea varias estrellitas con pequeñas variaciones de posición
  for (let i = 0; i < 2; i++) {
    const offsetX = x + (Math.random() - 0.5) * 25;
    const offsetY = y + (Math.random() - 0.5) * 25;
    createStar(offsetX, offsetY);
  }
}

document.addEventListener('mousemove', handlePointerMove);
document.addEventListener('touchmove', handlePointerMove);

/* ===============================
   ✨ EFECTO DE ESTRELLITAS DORADAS
   =============================== */
function createStar(x, y) {
  const star = document.createElement('span');
  star.className = 'star';
  star.style.left = `${x}px`;
  star.style.top = `${y}px`;
  star.style.setProperty('--rot', `${Math.random() * 360}deg`);
  document.body.appendChild(star);
  setTimeout(() => star.remove(), 1000);
}
function handlePointerMove(e) {
  const x = e.clientX || (e.touches && e.touches[0].clientX);
  const y = e.clientY || (e.touches && e.touches[0].clientY);
  if (!x || !y) return;
  for (let i = 0; i < 2; i++) {
    const offsetX = x + (Math.random() - 0.5) * 25;
    const offsetY = y + (Math.random() - 0.5) * 25;
    createStar(offsetX, offsetY);
  }
}
document.addEventListener('mousemove', handlePointerMove);
document.addEventListener('touchmove', handlePointerMove);

/* ===============================
   💞 OBJETOS FLOTANTES EN CANVAS
   =============================== */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: 0, y: 0, radius: 100 };

// **VALOR CLAVE PARA AJUSTAR LA VELOCIDAD**
// Un valor más pequeño = velocidad más baja. Antes era 1.5.
const MAX_SPEED = 0.8;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor(x, y, size, img) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.img = img;
    this.dx = (Math.random() - 0.5) * MAX_SPEED;
    this.dy = (Math.random() - 0.5) * MAX_SPEED;
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.size, this.size);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    // Rebote en bordes
    if (this.x < 0 || this.x + this.size > canvas.width) this.dx *= -1;
    if (this.y < 0 || this.y + this.size > canvas.height) this.dy *= -1;

    // Interacción con el puntero
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < mouse.radius + this.size / 2) {
      this.dx = dx / dist * 2;
      this.dy = dy / dist * 2;
    }

    // Colisiones entre partículas
    for (let other of particles) {
      if (other === this) continue;
      const dx2 = other.x - this.x;
      const dy2 = other.y - this.y;
      const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
      if (dist2 < (this.size + other.size) / 2) {
        const angle = Math.atan2(dy2, dx2);
        this.dx -= Math.cos(angle);
        this.dy -= Math.sin(angle);
      }
    }

    this.draw();
  }
}

// Cargar imágenes de forma automática
const imgSources = [
  'assets/estrella3.jpg',
  'assets/estrella4.jpg',
  'assets/estrella5.jpg',
  'assets/jona.png'
];
const loadedImgs = [];

imgSources.forEach(src => {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    loadedImgs.push(img);
    if (loadedImgs.length === imgSources.length) initParticles();
  };
});

function initParticles() {
  for (let i = 0; i < 25; i++) {
    const img = loadedImgs[Math.floor(Math.random() * loadedImgs.length)];
    const size = 40 + Math.random() * 30;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    particles.push(new Particle(x, y, size, img));
  }
  animate();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => p.update());
  requestAnimationFrame(animate);
}

document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
document.addEventListener('touchmove', e => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
});