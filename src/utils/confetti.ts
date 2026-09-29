// Lightweight zero-dependency canvas confetti
export function fireConfetti() {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#fbbf24', '#ffffff'];
  const particleCount = 70;
  const particles = Array.from({ length: particleCount }).map(() => ({
    x: width * 0.5 + (Math.random() - 0.5) * 200,
    y: height * 0.6,
    vx: (Math.random() - 0.5) * 16,
    vy: -Math.random() * 14 - 6,
    size: Math.random() * 8 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    opacity: 1,
  }));

  let animationFrameId: number;
  let frame = 0;

  function render() {
    frame++;
    ctx!.clearRect(0, 0, width, height);

    let activeParticles = 0;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.vx *= 0.98; // drag
      p.rotation += p.rotationSpeed;
      if (frame > 30) {
        p.opacity -= 0.02;
      }

      if (p.opacity > 0 && p.y < height + 50) {
        activeParticles++;
        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.rotation * Math.PI) / 180);
        ctx!.globalAlpha = Math.max(0, p.opacity);
        ctx!.fillStyle = p.color;
        ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx!.restore();
      }
    }

    if (activeParticles > 0 && frame < 120) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      canvas.remove();
    }
  }

  render();
}
