const start = document.getElementById('screen-start');
const game = document.getElementById('screen-game');
const endS = document.getElementById('screen-end');
const startBtn = document.getElementById('startBtn');
const replayBtn = document.getElementById('replayBtn');
const grid = document.getElementById('grid');
const bgm = document.getElementById('bgm');
const sBubble = document.getElementById('sfx-bubble');
const sCelebrate = document.getElementById('sfx-celebrate');
const toggleMusic = document.getElementById('toggleMusic');
const muteBtn = document.getElementById('muteBtn');

// Texto de pistas
const clues = [
  "Capitán Cangrejo dice: ¡Ay caracoles, Santis! Gary dejó migas donde tú comes. Busca tu próxima pista en la mesa.",
  "Capitán Cangrejo dice: Bob Esponja cocina Cangreburguers. La espátula está donde guardas los utensilios de cocina.",
  "Capitán Cangrejo dice: Después de un baño de burbujas, la pista aparece cerca de las toallas del baño.",
  "Capitán Cangrejo dice: Plankton escondió algo donde sueñas: debajo de tu cama.",
  "Calamardo cuida el pasillo con su clarinete. La siguiente pista está por ahí.",
  "El bote-móvil está estacionado. Busca la pista donde se guardan los autos.",
  "Has llegado casi al final, Santis. El regalo está donde se guarda la pijama favorita.",
  "🎉 ¡Sorpresa, Santis! Busca tu tesoro en tu habitación."
];

// Imágenes (deben existir en /assets con estos nombres)
const images = ["bob.png","patrick.png","gary.png","squidward.png","plankton.png","mrkrabs.png","bob.png","patrick.png"];

let next = 0;

// ----- Pantallas -----
function showStart() {
  start.classList.add('active'); start.classList.remove('hidden');
  game.classList.add('hidden');  game.classList.remove('active');
  endS.classList.add('hidden');  endS.classList.remove('active');
}
function showGame() {
  start.classList.add('hidden'); start.classList.remove('active');
  game.classList.add('active');  game.classList.remove('hidden');
  endS.classList.add('hidden');  endS.classList.remove('active');
}
function showEnd() {
  game.classList.add('hidden');  game.classList.remove('active');
  endS.classList.add('active');   endS.classList.remove('hidden');
  sCelebrate.currentTime = 0; sCelebrate.play();
}

// ----- Música -----
function startMusic() {
  // Se llama tras un clic del usuario (permite reproducir en móviles)
  bgm.currentTime = 0;
  const p = bgm.play();
  if (p && p.catch) p.catch(()=>{ /* si se bloquea, el botón toggleMusic permite reanudar */ });
}

// ----- Grid -----
function buildGrid() {
  grid.innerHTML = '';
  next = 0;
  for (let i = 0; i < 8; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.idx = i;

    const img = document.createElement('img');
    img.src = 'assets/' + images[i];
    img.alt = 'personaje ' + (i+1);

    const lock = document.createElement('div');
    lock.className = 'lock';
    lock.textContent = '🔒';

    const text = document.createElement('div');
    text.className = 'text';
    text.textContent = 'Pista ' + (i+1) + ' — toca para revelar';

    card.appendChild(img); card.appendChild(lock); card.appendChild(text);

    card.addEventListener('click', () => {
      const idx = Number(card.dataset.idx);
      if (idx !== next) { card.style.transform = 'translateX(-3px)'; setTimeout(()=>card.style.transform='',120); return; }
      sBubble.currentTime = 0; sBubble.play();
      card.classList.add('unlocked');
      text.textContent = clues[idx];
      next++;
      if (next >= 8) setTimeout(showEnd, 400);
    });

    grid.appendChild(card);
  }
}

// ----- Botones -----
startBtn.addEventListener('click', () => {
  buildGrid();
  showGame();
  startMusic(); // inicia música tras interacción
});

replayBtn.addEventListener('click', () => {
  bgm.pause();
  showStart();
});

toggleMusic.addEventListener('click', () => {
  if (bgm.paused) { bgm.play(); toggleMusic.textContent = 'Pausar música'; }
  else { bgm.pause(); toggleMusic.textContent = 'Reanudar música'; }
});

muteBtn.addEventListener('click', () => {
  bgm.muted = !bgm.muted;
  sBubble.muted = bgm.muted;
  sCelebrate.muted = bgm.muted;
  muteBtn.textContent = bgm.muted ? '🔇' : '🔊';
});

// ----- Burbujas de fondo -----
function spawnBubbles(){
  const container = document.querySelector('.bubbles');
  for (let i = 0; i < 20; i++) {
    const b = document.createElement('div');
    b.className = 'bubble-f';
    const size = Math.random() * 40 + 10;
    b.style.width = size + 'px';
    b.style.height = size + 'px';
    b.style.left = (Math.random() * 100) + 'vw';
    b.style.animationDuration = (8 + Math.random() * 8) + 's';
    b.style.animationDelay = (Math.random() * 8) + 's';
    container.appendChild(b);
  }
}

// Asegura que SIEMPRE inicie en la pantalla de inicio
document.addEventListener('DOMContentLoaded', () => {
  showStart();
  spawnBubbles();
});
