// =========================================================
// RAMO DE AUTOS "TQM LIZ" — INTERACTIVIDAD Y PARTÍCULAS
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  const cars = document.querySelectorAll('.car-flower');
  const bubbleName = document.getElementById('bubble-car-name');
  const bubbleQuote = document.getElementById('bubble-car-quote');
  const speechBubble = document.getElementById('car-message');
  const btnLights = document.getElementById('btn-lights');
  const btnTurbo = document.getElementById('btn-turbo');
  const btnCard = document.getElementById('btn-card');
  const bouquetTagBtn = document.getElementById('bouquet-tag-btn');
  const plateBadge = document.getElementById('plate-badge');
  const bouquetWrapper = document.getElementById('bouquet');
  const speedoText = document.getElementById('speedo-text');

  // Modal elementos
  const cardModal = document.getElementById('card-modal');
  const closeModal = document.getElementById('close-modal');
  const btnCelebrate = document.getElementById('btn-celebrate');

  // =========================================================
  // EFECTOS DE SONIDO SINTETIZADOS (Web Audio API)
  // =========================================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Sonido suave de motor deportivo + campanita mágica al tocar un auto
  function playCarChime(pitchMultiplier = 1) {
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5].map(f => f * pitchMultiplier);
      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.055);

        gain.gain.setValueAtTime(0.001, now + idx * 0.055);
        gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.055 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.055 + 0.45);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.055);
        osc.stop(now + idx * 0.055 + 0.48);
      });
    } catch (_) {}
  }

  // Sonido de acelerón Turbo ("Vroom!")
  function playTurboRev() {
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.5);
      osc.frequency.exponentialRampToValueAtTime(310, now + 0.95);
      osc.frequency.exponentialRampToValueAtTime(80, now + 1.4);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.45);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.5);
    } catch (_) {}
  }

  // Claxon simpático "Beep Beep TQM!"
  function playHornBeep() {
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      [0, 0.18].forEach(offset => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(660, now + offset);

        gain.gain.setValueAtTime(0.09, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.13);
      });
    } catch (_) {}
  }

  // =========================================================
  // INTERACCIÓN CON CADA AUTO DEL RAMO
  // =========================================================
  cars.forEach((car, index) => {
    car.addEventListener('click', () => {
      cars.forEach(c => c.classList.remove('selected'));
      car.classList.add('selected');

      const carName = car.getAttribute('data-car');
      const carQuote = car.getAttribute('data-quote');

      bubbleName.textContent = `🏎️ ${carName} 🌸`;
      bubbleQuote.textContent = carQuote;

      speechBubble.classList.remove('pop');
      void speechBubble.offsetWidth;
      speechBubble.classList.add('pop');

      playCarChime(0.9 + index * 0.05);
      const rect = car.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 3;
      spawnBurst(centerX, centerY, 18);
    });
  });

  // Clic en la placa TQM-LIZ
  plateBadge.addEventListener('click', () => {
    playHornBeep();
    const rect = plateBadge.getBoundingClientRect();
    spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 16);
    bubbleName.textContent = '🔊 ¡BEEP BEEP, LIZ! 💖';
    bubbleQuote.textContent = 'Placa oficial registrada a nombre de: ¡La persona más especial del mundo! TQM Liz ✨';
  });

  // =========================================================
  // BOTONES DE CONTROL (LUCES, TURBO, TARJETA)
  // =========================================================
  btnLights.addEventListener('click', () => {
    const isNight = document.body.classList.toggle('lights-on');
    btnLights.classList.toggle('active', isNight);
    const textSpan = btnLights.querySelector('.btn-text');
    textSpan.textContent = isNight ? 'Apagar Luces' : 'Encender Luces';
    playCarChime(isNight ? 1.15 : 0.85);
  });

  let turboTimeout = null;
  btnTurbo.addEventListener('click', () => {
    playTurboRev();
    document.body.classList.add('lights-on');
    btnLights.classList.add('active');
    btnLights.querySelector('.btn-text').textContent = 'Apagar Luces';

    bouquetWrapper.classList.add('turbo-shake');
    speedoText.textContent = '∞ RPM — ¡MODO TURBO TQM LIZ ACTIVADO! 🚀❤️‍🔥';

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        spawnBurst(
          window.innerWidth * (0.2 + Math.random() * 0.6),
          window.innerHeight * (0.2 + Math.random() * 0.5),
          22
        );
      }, i * 220);
    }

    clearTimeout(turboTimeout);
    turboTimeout = setTimeout(() => {
      bouquetWrapper.classList.remove('turbo-shake');
      speedoText.textContent = '9,999 RPM — ¡TQM AL MÁXIMO, LIZ! 💖🏁';
    }, 2200);
  });

  // Abrir y cerrar modal de dedicatoria
  function openCardModal() {
    cardModal.classList.add('open');
    cardModal.setAttribute('aria-hidden', 'false');
    playCarChime(1.05);
    spawnBurst(window.innerWidth / 2, window.innerHeight / 2, 25);
  }

  function closeCardModal() {
    cardModal.classList.remove('open');
    cardModal.setAttribute('aria-hidden', 'true');
  }

  btnCard.addEventListener('click', openCardModal);
  bouquetTagBtn.addEventListener('click', openCardModal);
  closeModal.addEventListener('click', closeCardModal);

  cardModal.addEventListener('click', (e) => {
    if (e.target === cardModal) closeCardModal();
  });

  btnCelebrate.addEventListener('click', () => {
    closeCardModal();
    btnTurbo.click();
  });

  // =========================================================
  // SISTEMA DE PARTÍCULAS (CORAZONES, PÉTALOS Y DESTELLOS)
  // =========================================================
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const ambientParticles = [];
  const burstParticles = [];
  const symbols = ['💖', '🌸', '✨', '🏎️', '🌷', '💕', '⭐'];

  for (let i = 0; i < 32; i++) {
    ambientParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 6 + Math.random() * 10,
      speedY: -0.35 - Math.random() * 0.65,
      speedX: (Math.random() - 0.5) * 0.5,
      alpha: 0.25 + Math.random() * 0.55,
      type: Math.random() > 0.35 ? 'heart' : 'sparkle',
      color: ['#ff4d8d', '#ff9ebb', '#ffd166', '#00f5d4'][Math.floor(Math.random() * 4)]
    });
  }

  function spawnBurst(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 2.5 + Math.random() * 6.5;
      burstParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        gravity: 0.12,
        alpha: 1,
        decay: 0.014 + Math.random() * 0.012,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        fontSize: 16 + Math.random() * 14
      });
    }
  }

  function drawHeart(ctx, x, y, size, color, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.4, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.4, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    ambientParticles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      if (p.y < -20) {
        p.y = height + 20;
        p.x = Math.random() * width;
      }
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;

      if (p.type === 'heart') {
        drawHeart(ctx, p.x, p.y, p.size, p.color, p.alpha);
      } else {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const b = burstParticles[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += b.gravity;
      b.alpha -= b.decay;

      if (b.alpha <= 0) {
        burstParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, b.alpha);
      ctx.font = `${b.fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.symbol, b.x, b.y);
      ctx.restore();
    }

    requestAnimationFrame(animateParticles);
  }

  animateParticles();
});
