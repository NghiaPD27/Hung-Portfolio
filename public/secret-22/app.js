const stage = document.getElementById('stage');
const intro = document.getElementById('screen1');
const wish = document.getElementById('screen2');
const cake = document.getElementById('screen3');
const greeting = document.getElementById('screen4');
const happy = document.getElementById('happy');
const permission = document.getElementById('permission');
const motionStatus = document.getElementById('status');
const candle = document.querySelector('.candle');
const flame = document.querySelector('.flame-origin');
const light = document.querySelector('.reveal-light');
const halo = document.querySelector('.reveal-halo');
const wash = document.querySelector('.reveal-wash');
const fireworks = document.querySelector('.fireworks');
const themeColor = document.querySelector('meta[name="theme-color"]');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

let scene = 'intro';
let sceneMotion;
let fireworksMotion;
let previousAcceleration;
let lastShakeTime = -Infinity;
let shakeCount = 0;

const introMotion = gsap.matchMedia();
introMotion.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.to('.i, .r, .t, .h, .a', {
    y: (index) => index % 2 === 0 ? -4 : 4,
    duration: 1.5, ease: 'sine.inOut', repeat: -1, yoyo: true, stagger: 0.18,
  });
  gsap.to('.character', {
    rotation: 1.1, transformOrigin: '82% 87%',
    duration: 1.25, ease: 'sine.inOut', repeat: -1, yoyo: true,
  });
  gsap.to('.happy img', {
    scale: 1.025, duration: 1.2, ease: 'sine.inOut', repeat: -1, yoyo: true,
  });
});

function activate(screen, name, color) {
  scene = name;
  document.body.dataset.screen = name;
  themeColor.content = color;
  screen.inert = false;
  screen.focus({ preventScroll: true });
}

function startCandleMotion() {
  sceneMotion = gsap.matchMedia();
  sceneMotion.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo(candle, { rotation: -2.3 }, {
      rotation: 2.3, transformOrigin: '50% 86%',
      duration: 1.3, ease: 'sine.inOut', repeat: -1, yoyo: true,
    });
    gsap.to('.flame-glow', {
      opacity: 0.36, scale: 1.15,
      duration: 0.95, ease: 'sine.inOut', repeat: -1, yoyo: true,
    });
  });
}

function openWish() {
  if (scene !== 'intro') return;

  fireworkAudio.unlock();
  scene = 'entering-wish';
  intro.inert = true;
  wish.hidden = false;
  wish.inert = true;
  // iOS can require the permission request in the same tap that opens the scene.
  requestMotion();

  const reduced = motionPreference.matches;
  gsap.timeline({
    onComplete() {
      intro.hidden = true;
      introMotion.revert();
      activate(wish, 'wish', '#000000');
      startCandleMotion();
    },
  })
    .fromTo(wish, { opacity: 0 }, { opacity: 1, duration: reduced ? 0.15 : 0.65, ease: 'sine.inOut' })
    .fromTo('.candle-position', { opacity: 0 }, { opacity: 1, duration: reduced ? 0.15 : 0.55 }, reduced ? 0 : 0.2);
}

function stopFireworks() {
  fireworksMotion?.kill();
  fireworksMotion = null;
  fireworks.replaceChildren();
  fireworkAudio.stop();
}

function playFireworks() {
  if (motionPreference.matches) return;

  const { clientWidth: width, clientHeight: height } = fireworks;
  const spread = Math.min(width, height) * 0.24;
  const palette = ['#f70063', '#b734ff', '#e88c00', '#007e6e', '#002bff'];
  const launches = [
    { start: 0.16, end: 0.28, top: 0.26, time: 0 },
    { start: 0.84, end: 0.72, top: 0.23, time: 0.16 },
    { start: 0.52, end: 0.51, top: 0.34, time: 0.42 },
  ];
  const particles = document.createDocumentFragment();

  function particle(shape, color) {
    const element = document.createElement('span');
    element.className = `firework-${shape}`;
    element.style.setProperty('--spark-color', color);
    particles.append(element);
    return element;
  }

  fireworksMotion = gsap.timeline({ paused: true, onComplete: stopFireworks });
  launches.forEach(({ start, end, top, time }, index) => {
    const x = width * end;
    const y = height * top;
    const burstTime = time + 0.6;
    const rocket = particle('rocket', palette[index]);
    fireworksMotion
      .set(rocket, { x: width * start, y: height * 0.95, opacity: 1 }, time)
      .call(fireworkAudio.play, ['launch'], time)
      .to(rocket, { x, y, duration: 0.6, ease: 'power1.out' }, time)
      .set(rocket, { opacity: 0 }, burstTime)
      .call(fireworkAudio.play, ['burst'], burstTime);

    for (let i = 0; i < 18; i++) {
      const spark = particle('spark', palette[(i + index) % palette.length]);
      const angle = i * Math.PI * 2 / 18 + index * 0.3;
      const distance = spread * gsap.utils.random(0.55, 1);
      const endX = x + Math.cos(angle) * distance;
      const endY = y + Math.sin(angle) * distance;
      fireworksMotion
        .set(spark, { x, y, opacity: 1, scale: gsap.utils.random(0.55, 1.25) }, burstTime)
        .to(spark, { x: endX, y: endY, duration: 0.48, ease: 'power3.out' }, burstTime)
        .to(spark, {
          x: endX + Math.cos(angle) * 24,
          y: endY + height * gsap.utils.random(0.32, 0.67),
          duration: gsap.utils.random(0.85, 1.35),
          ease: 'power1.in',
        }, burstTime + 0.48)
        .to(spark, { opacity: 0, scale: 0.2, duration: 0.9, ease: 'sine.in' }, burstTime + 0.85);
    }
  });

  fireworks.append(particles);
  fireworksMotion.play();
}

function openCake() {
  if (scene !== 'wish') return;

  scene = 'revealing-cake';
  window.removeEventListener('devicemotion', detectShake);
  sceneMotion?.kill();
  cake.inert = true;

  function finishReveal() {
    wish.hidden = true;
    light.hidden = true;
    activate(cake, 'cake', '#fff2eb');
  }

  if (motionPreference.matches) {
    cake.hidden = false;
    fireworkAudio.startMusic();
    gsap.fromTo(cake, { opacity: 0 }, { opacity: 1, duration: 0.18, onComplete: finishReveal });
    return;
  }

  const stageBounds = stage.getBoundingClientRect();
  const flameBounds = flame.getBoundingClientRect();
  const x = flameBounds.left - stageBounds.left;
  const y = flameBounds.top - stageBounds.top;
  const radius = Math.hypot(
    Math.max(x, stageBounds.width - x),
    Math.max(y, stageBounds.height - y),
  );

  light.hidden = false;
  gsap.set(halo, { left: x, top: y, scale: 0.24, opacity: 0.7 });
  gsap.set(wash, { opacity: 0 });

  gsap.timeline({ onComplete: finishReveal })
    .to(halo, { scale: radius / 28, opacity: 1, duration: 1.35, ease: 'power2.inOut' })
    .to(wash, { opacity: 1, duration: 0.6, ease: 'sine.inOut' }, 0.75)
    .add(() => { cake.hidden = false; })
    .addLabel('cake-reveal', '+=0.1')
    .to(light, { opacity: 0, duration: 0.85, ease: 'sine.out' }, 'cake-reveal')
    .from('.birthday-title, .name', {
      opacity: 0, y: 10, duration: 0.65, ease: 'power2.out', stagger: 0.1,
    }, '<0.1')
    .from('.cake img', { opacity: 0, scale: 0.94, duration: 0.65, ease: 'power2.out' }, '<')
    .from('.next img', { opacity: 0, duration: 0.35 }, '<0.4')
    .call(fireworkAudio.startMusic, [], 'cake-reveal')
    .call(playFireworks, [], 'cake-reveal+=0.16');
}

function detectShake(event) {
  if (scene !== 'wish') return;

  const acceleration = event.accelerationIncludingGravity ?? event.acceleration;
  if (!acceleration) return;

  const { x, y, z } = acceleration;
  if (![x, y, z].every(Number.isFinite)) return;

  const previous = previousAcceleration;
  previousAcceleration = { x, y, z };
  if (!previous) return;

  const delta = Math.abs(x - previous.x) + Math.abs(y - previous.y) + Math.abs(z - previous.z);
  const now = performance.now();
  if (delta <= 20 || now - lastShakeTime <= 120) return;

  shakeCount = now - lastShakeTime < 1200 ? shakeCount + 1 : 1;
  lastShakeTime = now;
  if (shakeCount >= 2) openCake();
}

function openGreeting() {
  if (scene !== 'cake') return;

  stopFireworks();
  scene = 'entering-greeting';
  greeting.hidden = false;
  greeting.inert = true;
  cake.inert = true;

  const reduced = motionPreference.matches;
  const transition = gsap.timeline({
    onComplete() {
      cake.hidden = true;
      activate(greeting, 'greeting', '#c80000');
    },
  });
  transition.fromTo(greeting, { opacity: 0 }, {
    opacity: 1, duration: reduced ? 0.15 : 0.6, ease: 'sine.inOut',
  });

  if (!reduced) {
    transition
      .from('.greeting-date', { opacity: 0, y: -12, duration: 0.6, ease: 'power2.out' }, 0.12)
      .from('.greeting-portrait, .greeting-age', {
        opacity: 0, x: -12, duration: 0.7, ease: 'power2.out',
      }, 0.18)
      .from('.greeting-intro, .greeting-message, .greeting-future', {
        opacity: 0, y: 8, duration: 0.45, ease: 'power2.out', stagger: 0.14,
      }, 0.32);
  }
}

async function requestMotion() {
  const motion = window.DeviceMotionEvent;
  if (!motion) {
    motionStatus.textContent = 'Thiết bị này không hỗ trợ cảm biến chuyển động.';
    return;
  }

  if (typeof motion.requestPermission === 'function') {
    try {
      if (await motion.requestPermission() !== 'granted') {
        throw new Error('Motion permission denied');
      }
    } catch {
      permission.hidden = false;
      motionStatus.textContent = 'Hãy cho phép cảm biến để lắc điện thoại nhé.';
      return;
    }
  }

  permission.hidden = true;
  motionStatus.textContent = '';
  window.addEventListener('devicemotion', detectShake);
}

happy.addEventListener('click', openWish);
permission.addEventListener('click', () => {
  fireworkAudio.unlock();
  requestMotion();
});
document.getElementById('next').addEventListener('click', openGreeting);
