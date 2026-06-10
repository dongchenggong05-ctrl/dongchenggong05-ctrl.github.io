/* San — AI Creative Builder
   读取 data.json 并渲染整个页面。只有这一份脚本文件。 */

const text = (id, value) => {
  document.getElementById(id).textContent = value;
};

/* ---------- 开场动画：金色星尘从四周汇聚成衬线体 "San" ---------- */

const initIntro = () => {
  const intro = document.getElementById("intro");
  const canvas = document.getElementById("introCanvas");
  if (!intro || !canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    intro.classList.add("is-hidden");
    return;
  }

  const ctx = canvas.getContext("2d");
  const introWord = "San";
  const particleCount = 1800;
  const duration = 3600;
  const particles = [];
  let width = 0;
  let height = 0;
  let startedAt = performance.now();
  let hasEntered = false;
  let animationFrame = null;

  const easeInOut = (v) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);

  const introFont = () =>
    `italic 400 ${Math.min(width * 0.24, 180)}px Georgia, "Times New Roman", "Songti SC", serif`;

  const getEdgePoint = () => {
    const side = Math.floor(Math.random() * 4);
    const margin = 80;
    if (side === 0) return { x: Math.random() * width, y: -margin };
    if (side === 1) return { x: width + margin, y: Math.random() * height };
    if (side === 2) return { x: Math.random() * width, y: height + margin };
    return { x: -margin, y: Math.random() * height };
  };

  const createTextTargets = () => {
    const textCanvas = document.createElement("canvas");
    const textCtx = textCanvas.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    textCanvas.width = Math.floor(width * ratio);
    textCanvas.height = Math.floor(height * ratio);
    textCtx.scale(ratio, ratio);
    textCtx.fillStyle = "#ffffff";
    textCtx.textAlign = "center";
    textCtx.textBaseline = "middle";
    textCtx.font = introFont();
    textCtx.fillText(introWord, width / 2, height / 2);

    const pixels = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height).data;
    const targets = [];
    const step = Math.max(2, Math.floor(3.5 * ratio));
    for (let y = 0; y < textCanvas.height; y += step) {
      for (let x = 0; x < textCanvas.width; x += step) {
        if (pixels[(y * textCanvas.width + x) * 4 + 3] > 80) {
          targets.push({
            x: x / ratio + (Math.random() - 0.5) * 1.4,
            y: y / ratio + (Math.random() - 0.5) * 1.4,
          });
        }
      }
    }
    return targets.sort(() => Math.random() - 0.5).slice(0, particleCount);
  };

  const buildParticles = () => {
    particles.length = 0;
    createTextTargets().forEach((target, index, all) => {
      const start = getEdgePoint();
      particles.push({
        startX: start.x,
        startY: start.y,
        targetX: target.x,
        targetY: target.y,
        delay: (index / all.length) * 680 + Math.random() * 360,
        size: Math.random() * 0.72 + 0.34,
        alpha: Math.random() * 0.34 + 0.42,
        drift: Math.random() * Math.PI * 2,
      });
    });
  };

  const resizeCanvas = () => {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    buildParticles();
    startedAt = performance.now();
  };

  const drawGlowText = (alpha) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = introFont();
    ctx.shadowColor = "rgba(216, 179, 106, 0.35)";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "rgba(216, 179, 106, 0.24)";
    ctx.fillText(introWord, width / 2, height / 2);
    ctx.restore();
  };

  const enterSite = () => {
    if (hasEntered) return;
    hasEntered = true;
    intro.classList.add("is-hidden");
    document.body.classList.remove("intro-active");
    if (animationFrame) cancelAnimationFrame(animationFrame);
    window.removeEventListener("resize", resizeCanvas);
  };

  const animate = (now) => {
    const elapsed = now - startedAt;
    const progress = Math.min(elapsed / duration, 1);

    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      const local = Math.min(Math.max((elapsed - p.delay) / (duration - 650), 0), 1);
      const eased = easeInOut(local);
      const settle = Math.max(local - 0.84, 0) * 8;
      const driftX = Math.sin(now * 0.00032 + p.drift) * (1 - eased) * 10;
      const driftY = Math.cos(now * 0.00028 + p.drift) * (1 - eased) * 10;
      ctx.beginPath();
      ctx.globalAlpha = Math.min(p.alpha + settle * 0.06, 0.92);
      ctx.fillStyle = "rgba(216, 179, 106, 1)";
      ctx.arc(
        p.startX + (p.targetX - p.startX) * eased + driftX,
        p.startY + (p.targetY - p.startY) * eased + driftY,
        p.size,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    if (progress > 0.86) drawGlowText((progress - 0.86) / 0.14);
    if (progress >= 1) {
      window.setTimeout(enterSite, 600);
      return;
    }
    animationFrame = requestAnimationFrame(animate);
  };

  document.body.classList.add("intro-active");
  resizeCanvas();
  animationFrame = requestAnimationFrame(animate);
  window.addEventListener("resize", resizeCanvas);
  intro.addEventListener("click", enterSite);
};

initIntro();

const render = (data) => {
  const { profile, directions, works } = data;

  // Hero
  text("heroEyebrow", profile.eyebrow);
  text("heroName", profile.name);
  text("heroTagline", profile.tagline);
  text("heroIntro", profile.intro);
  document.title = `${profile.name} — ${profile.eyebrow}`;

  // Stats
  const done = works.filter((w) => w.status === "已完成").length;
  const stats = [
    [works.length, "作品记录"],
    [done, "已完成"],
    [directions.length, "创作方向"],
  ];
  document.getElementById("heroStats").innerHTML = stats
    .map(([num, label]) => `<div><strong>${num}</strong><span>${label}</span></div>`)
    .join("");

  // Featured works
  const featured = works.filter((w) => w.featured);
  document.getElementById("featuredList").innerHTML = featured
    .map(
      (w, i) => `
      <article class="featured-item reveal">
        <span class="featured-no">${String(i + 1).padStart(2, "0")}</span>
        <div>
          <h3>${w.title}</h3>
          <p class="featured-meta">${w.type} · ${w.date} · <span class="status">${w.status}</span></p>
          <p class="desc">${w.description}</p>
        </div>
      </article>`
    )
    .join("");

  // Directions
  document.getElementById("directionGrid").innerHTML = directions
    .map(
      (d) => `
      <div class="direction-card reveal">
        <h3>${d.title}</h3>
        <p>${d.description}</p>
      </div>`
    )
    .join("");

  // Archive（按日期倒序）
  const sorted = [...works].sort((a, b) => b.date.localeCompare(a.date));
  document.getElementById("archiveList").innerHTML = sorted
    .map(
      (w) => `
      <li class="reveal">
        <span class="archive-date">${w.date}</span>
        <span class="archive-title">${w.title}<span class="archive-type">${w.type} — ${w.description}</span></span>
        <span class="archive-status">${w.status}</span>
      </li>`
    )
    .join("");

  // About / Contact / Footer
  text("aboutText", profile.about);
  const contact = document.getElementById("contactLink");
  contact.href = `mailto:${profile.email}`;
  text("footerLine", `© ${new Date().getFullYear()} ${profile.footer}`);

  // Reveal on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
};

fetch("./data.json", { cache: "no-store" })
  .then((res) => {
    if (!res.ok) throw new Error(`data.json ${res.status}`);
    return res.json();
  })
  .then(render)
  .catch((err) => {
    console.error("无法加载 data.json", err);
  });
