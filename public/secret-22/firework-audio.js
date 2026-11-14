const fireworkAudio = (() => {
  let context;
  let sounds;
  let effectsVolume;
  let musicBuffer;
  let musicRequested = false;
  const playing = new Set();

  function createSound(duration, sample) {
    const { sampleRate } = context;
    const buffer = context.createBuffer(1, Math.ceil(sampleRate * duration), sampleRate);
    const samples = buffer.getChannelData(0);
    let smoothNoise = 0;
    let phase = 0;

    for (let i = 0; i < samples.length; i++) {
      const progress = i / (samples.length - 1);
      const noise = Math.random() * 2 - 1;
      smoothNoise += (noise - smoothNoise) * 0.12;
      phase += 2 * Math.PI * (390 + 850 * progress ** 1.5) / sampleRate;
      samples[i] = sample(progress, noise, smoothNoise, phase);
    }

    return buffer;
  }

  function unlock() {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;

    try {
      context ??= new Audio();
      if (context.state !== 'running') {
        // Keep resume in the tap handler so mobile browsers can allow playback.
        context.resume().catch(() => {});
      }

      if (!effectsVolume) {
        effectsVolume = context.createGain();
        effectsVolume.gain.value = 1.32;
        effectsVolume.connect(context.destination);
      }

      sounds ??= {
        launch: createSound(0.52, (progress, noise, smooth, phase) => {
          const envelope = Math.sin(Math.PI * progress) ** 1.2;
          return envelope * (0.105 * Math.sin(phase) + 0.16 * smooth + 0.025 * noise);
        }),
        burst: createSound(0.32, (progress, noise, smooth) => {
          const attack = Math.min(progress * 65, 1);
          return attack * (
            (0.27 * smooth + 0.105 * noise) * Math.exp(-7 * progress) +
            0.08 * Math.sin(2 * Math.PI * (35 * progress - 18 * progress ** 2)) * Math.exp(-12 * progress)
          );
        }),
      };

      musicBuffer ??= fetch('assets/birthday-music.mp3')
        .then((response) => {
          if (!response.ok) throw new Error('Music could not load');
          return response.arrayBuffer();
        })
        .then((data) => context.decodeAudioData(data))
        .catch(() => null);
    } catch {
      // Audio availability must never block the birthday sequence.
    }
  }

  function play(name) {
    if (context?.state !== 'running' || !sounds) return;

    const source = context.createBufferSource();
    source.buffer = sounds[name];
    source.connect(effectsVolume);
    source.onended = () => {
      source.disconnect();
      playing.delete(source);
    };
    source.start();
    playing.add(source);
  }

  function stop() {
    for (const source of playing) {
      source.stop();
      source.disconnect();
    }
    playing.clear();
  }

  async function startMusic() {
    if (!musicBuffer || musicRequested) return;
    musicRequested = true;

    const buffer = await musicBuffer;
    if (!buffer || context.state !== 'running') return;

    const source = context.createBufferSource();
    const volume = context.createGain();
    source.buffer = buffer;
    source.connect(volume);
    volume.connect(context.destination);

    const start = context.currentTime;
    volume.gain.setValueAtTime(0, start);
    volume.gain.linearRampToValueAtTime(1, start + 1.25);
    source.onended = () => {
      source.disconnect();
      volume.disconnect();
    };
    source.start(start);
  }

  return { unlock, play, stop, startMusic };
})();
