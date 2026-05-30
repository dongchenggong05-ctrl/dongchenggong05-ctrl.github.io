const data = window.profileData;

const page = document.body.dataset.page;
const currentTrackId = document.body.dataset.track;
const taskStorageKey = "sanGrowthTaskCompletions";

const formatPercent = (value, target) => {
  if (!target) return 0;
  return Math.min(Math.round((value / target) * 100), 100);
};

const getTodayKey = () => {
  return new Date().toLocaleDateString("sv-SE");
};

const getWeekKey = () => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstDay) / 86400000);
  const week = Math.ceil((days + firstDay.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${String(week).padStart(2, "0")}`;
};

const readTaskRecords = () => {
  try {
    const records = JSON.parse(localStorage.getItem(taskStorageKey) || "[]");
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
};

const writeTaskRecords = (records) => {
  localStorage.setItem(taskStorageKey, JSON.stringify(records));
};

const getWorkXp = (work) => {
  if (work.status !== "已完成") return 0;

  const baseXp = data.xpRules[work.track] || 0;
  const caseStudyXp = work.isCaseStudy ? data.xpRules.caseStudy : 0;
  return baseXp + caseStudyXp;
};

const sumWorkXp = (items) => items.reduce((total, item) => total + getWorkXp(item), 0);

const sumTaskXp = (trackId) => {
  return readTaskRecords()
    .filter((record) => !trackId || record.track === trackId)
    .reduce((total, record) => total + (record.earnedXp ?? record.xp ?? 0), 0);
};

const getTotalXp = () => sumWorkXp(data.works) + sumTaskXp();

const getTrack = (trackId) => data.tracks.find((track) => track.id === trackId);

const getTrackWorks = (trackId) => data.works.filter((work) => work.track === trackId);

const getTrackXp = (trackId) => sumWorkXp(getTrackWorks(trackId)) + sumTaskXp(trackId);

const sortByDateDesc = (items) => [...items].sort((a, b) => b.date.localeCompare(a.date));

const getTaskType = (taskTypeId) => data.taskTypes[taskTypeId];

const getTaskBaseXp = (task) => {
  return task.xp ?? getTaskType(task.taskType)?.baseXp ?? 0;
};

const getTaskTypeCount = (taskTypeId) => {
  return readTaskRecords().filter((record) => record.taskType === taskTypeId).length;
};

const getTaskMultiplier = (completedCount) => {
  if (completedCount < 5) return 1;
  if (completedCount < 15) return 0.7;
  return 0.4;
};

const getTaskEarnedXp = (task) => {
  const completedCount = getTaskTypeCount(task.taskType);
  return Math.round(getTaskBaseXp(task) * getTaskMultiplier(completedCount));
};

const getGrowthStage = (xp) => {
  return [...data.growthStages].reverse().find((stage) => xp >= stage.minXp) || data.growthStages[0];
};

const getWeeklyCompletion = () => {
  const records = readTaskRecords();
  const now = new Date();
  const day = now.getDay() || 7;
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(now.getDate() - day + 1);

  const completedThisWeek = records.filter((record) => new Date(record.completedAt) >= weekStart).length;
  const dailyCount = data.plannedTasks.filter((task) => task.cycleType === "每日").length;
  const weeklyCount = data.plannedTasks.filter((task) => task.cycleType === "每周").length;
  const weeklyTarget = dailyCount * 7 + weeklyCount;
  return `${completedThisWeek}/${weeklyTarget}`;
};

const getTaskPeriodKey = (task) => {
  if (task.cycleType === "每日") return getTodayKey();
  if (task.cycleType === "每周") return getWeekKey();
  return "once";
};

const isTaskCompleted = (task, records) => {
  const periodKey = getTaskPeriodKey(task);
  return records.some((record) => {
    if (record.taskId !== task.id) return false;
    if (record.periodKey === periodKey) return true;
    if (task.cycleType === "每日" && record.date === getTodayKey()) return true;
    if (task.cycleType === "每周" && record.week === getWeekKey()) return true;
    return task.cycleType === "一次性" && record.status === "已完成";
  });
};

const statusClass = (status) => {
  if (status === "已完成") return "done";
  if (status === "正在推进") return "active";
  return "draft";
};

const workCard = (work) => `
  <article class="work-card">
    <div class="work-meta">
      <span>${work.date}</span>
      <span class="status ${statusClass(work.status)}">${work.status}</span>
    </div>
    <h3>${work.title}</h3>
    <p>${work.description}</p>
    <strong>+${getWorkXp(work)} 经验值</strong>
  </article>
`;

const initGalaxyBackground = () => {
  const canvas = document.createElement("canvas");
  canvas.className = "galaxy-bg";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let stars = [];

  const createStars = () => {
    const density = page === "dashboard" ? 0.000105 : 0.00007;
    const count = Math.min(Math.floor(width * height * density), page === "dashboard" ? 170 : 115);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 0.85 + 0.25,
      a: Math.random() * 0.34 + 0.08,
      tint: Math.random()
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    stars.forEach((star) => {
      const color =
        star.tint > 0.82
          ? `rgba(165, 181, 255, ${star.a})`
          : star.tint > 0.62
            ? `rgba(231, 198, 152, ${star.a * 0.76})`
            : `rgba(242, 245, 247, ${star.a})`;

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    createStars();
    draw();
  };

  resize();
  window.addEventListener("resize", resize);
};

const initIntro = () => {
  const introScreen = document.querySelector("#introScreen");
  const canvas = document.querySelector("#introCanvas");
  const skipButton = document.querySelector("#introSkip");
  const welcomeBanner = document.querySelector("#welcomeBanner");
  if (!introScreen || !canvas || !skipButton) return;

  const ctx = canvas.getContext("2d");
  const particles = [];
  let width = 0;
  let height = 0;
  let startedAt = performance.now();
  let introReady = false;
  let animationFrame = null;

  // LOCKED INTRO: quiet golden galaxy dots slowly gathering into serif "san"; only micro-tune density, size, timing, or button style.
  const introWord = "san";
  const particleCount = 1800;
  const duration = 3900;

  const easeInOut = (value) => {
    return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
  };

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
    textCtx.clearRect(0, 0, width, height);
    textCtx.fillStyle = "#ffffff";
    textCtx.textAlign = "center";
    textCtx.textBaseline = "middle";
    textCtx.font = `500 ${Math.min(width * 0.205, 166)}px Georgia, "Times New Roman", serif`;
    textCtx.fillText(introWord, width / 2, height / 2);

    const pixels = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height).data;
    const targets = [];
    const step = Math.max(2, Math.floor(3.5 * ratio));

    for (let y = 0; y < textCanvas.height; y += step) {
      for (let x = 0; x < textCanvas.width; x += step) {
        const alpha = pixels[(y * textCanvas.width + x) * 4 + 3];
        if (alpha > 80) {
          targets.push({
            x: x / ratio + (Math.random() - 0.5) * 1.4,
            y: y / ratio + (Math.random() - 0.5) * 1.4
          });
        }
      }
    }

    return targets.sort(() => Math.random() - 0.5).slice(0, particleCount);
  };

  const buildParticles = () => {
    const targets = createTextTargets();
    particles.length = 0;

    targets.forEach((target, index) => {
      const start = getEdgePoint();
      particles.push({
        startX: start.x,
        startY: start.y,
        targetX: target.x,
        targetY: target.y,
        delay: (index / targets.length) * 680 + Math.random() * 360,
        size: Math.random() * 0.72 + 0.34,
        alpha: Math.random() * 0.34 + 0.42,
        drift: Math.random() * Math.PI * 2
      });
    });
  };

  const resizeCanvas = () => {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    buildParticles();
    startedAt = performance.now();
    introReady = false;
    introScreen.classList.remove("is-ready");
  };

  const drawGlowText = (alpha) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `500 ${Math.min(width * 0.205, 166)}px Georgia, "Times New Roman", serif`;
    ctx.shadowColor = "rgba(214, 154, 80, 0.34)";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "rgba(214, 154, 80, 0.22)";
    ctx.fillText(introWord, width / 2, height / 2);
    ctx.restore();
  };

  const animate = (now) => {
    const elapsed = now - startedAt;
    const progress = Math.min(elapsed / duration, 1);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(0, 20, 26, 0.24)";
    ctx.fillRect(0, 0, width, height);

    particles.forEach((particle) => {
      const localProgress = Math.min(Math.max((elapsed - particle.delay) / (duration - 650), 0), 1);
      const eased = easeInOut(localProgress);
      const settle = Math.max(localProgress - 0.84, 0) * 8;
      const driftX = Math.sin(now * 0.00032 + particle.drift) * (1 - eased) * 10;
      const driftY = Math.cos(now * 0.00028 + particle.drift) * (1 - eased) * 10;
      const x = particle.startX + (particle.targetX - particle.startX) * eased + driftX;
      const y = particle.startY + (particle.targetY - particle.startY) * eased + driftY;

      ctx.beginPath();
      ctx.globalAlpha = Math.min(particle.alpha + settle * 0.06, 0.92);
      ctx.fillStyle = "rgba(214, 154, 80, 1)";
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;

    if (progress > 0.86) {
      drawGlowText((progress - 0.86) / 0.14);
    }

    if (progress >= 1 && !introReady) {
      introReady = true;
      introScreen.classList.add("is-ready");
    }

    animationFrame = requestAnimationFrame(animate);
  };

  const enterDashboard = () => {
    introScreen.classList.add("is-hidden");
    document.body.classList.remove("intro-active");
    welcomeBanner?.classList.add("is-visible");
    if (animationFrame) cancelAnimationFrame(animationFrame);
  };

  document.body.classList.add("intro-active");
  resizeCanvas();
  animationFrame = requestAnimationFrame(animate);

  window.addEventListener("resize", resizeCanvas);
  skipButton.addEventListener("click", (event) => {
    event.stopPropagation();
    enterDashboard();
  });
  introScreen.addEventListener("click", () => {
    if (introReady) enterDashboard();
  });
};

const renderHero = () => {
  const totalXp = getTotalXp();
  const mainPercent = formatPercent(totalXp, data.mainGoal.targetXp);
  const completedWorks = data.works.filter((work) => work.status === "已完成").length;
  const activeProjects = data.works.filter((work) => work.status === "正在推进").length;
  const growthStage = getGrowthStage(totalXp);

  document.querySelector("#mainProgressValue").textContent = `${mainPercent}%`;
  document.querySelector("#mainProgressBar").style.width = `${mainPercent}%`;
  document.querySelector("#completedWorks").textContent = completedWorks;
  document.querySelector("#activeProjects") && (document.querySelector("#activeProjects").textContent = activeProjects);
  document.querySelector("#totalXp").textContent = totalXp;
  document.querySelector("#growthStage").textContent = growthStage.title;
  document.querySelector("#weeklyCompletion").textContent = getWeeklyCompletion();
};

const renderTasks = () => {
  const todayTaskGrid = document.querySelector("#todayTaskGrid");
  const weeklyTaskGrid = document.querySelector("#weeklyTaskGrid");
  const taskRecords = document.querySelector("#taskRecords");
  if (!todayTaskGrid || !weeklyTaskGrid || !taskRecords) return;

  const today = getTodayKey();
  const week = getWeekKey();
  const records = readTaskRecords();

  const renderTaskGroup = (tasks) =>
    tasks
    .map((task) => {
      const isDone = isTaskCompleted(task, records);
      const taskType = getTaskType(task.taskType);
      const completedTypeCount = getTaskTypeCount(task.taskType);
      const multiplier = getTaskMultiplier(completedTypeCount);
      const earnedXp = getTaskEarnedXp(task);

      return `
        <article class="task-card ${isDone ? "is-complete" : ""}">
          <div class="task-topline">
            <span>${taskType.title} / ${task.module}</span>
            <strong>+${earnedXp}</strong>
          </div>
          <h3>${task.title}</h3>
          <p>${task.description}</p>
          <div class="task-rule">
            <span>${task.cycleType}</span>
            <span>${task.capabilityModule}</span>
            <span>同类已完成 ${completedTypeCount} 次</span>
            <span>当前系数 ${Math.round(multiplier * 100)}%</span>
            ${task.canBecomeWork ? "<span>可沉淀为作品</span>" : ""}
          </div>
          <button class="task-action" type="button" data-task-id="${task.id}" ${isDone ? "disabled" : ""}>
            ${isDone ? "已完成" : "完成"}
          </button>
        </article>
      `;
    })
    .join("");

  todayTaskGrid.innerHTML = renderTaskGroup(data.plannedTasks.filter((task) => task.cycleType === "每日"));
  weeklyTaskGrid.innerHTML = renderTaskGroup(data.plannedTasks.filter((task) => task.cycleType === "每周"));

  document.querySelectorAll(".task-action:not(:disabled)").forEach((button) => {
    button.addEventListener("click", () => {
      const task = data.plannedTasks.find((item) => item.id === button.dataset.taskId);
      if (!task) return;
      const taskType = getTaskType(task.taskType);
      if (!taskType) return;

      const latestRecords = readTaskRecords();
      const periodKey = getTaskPeriodKey(task);
      const alreadyDone = latestRecords.some((record) => record.taskId === task.id && record.periodKey === periodKey);
      if (alreadyDone) {
        renderTasks();
        return;
      }

      writeTaskRecords([
        {
          taskId: task.id,
          title: task.title,
          mainGoal: task.mainGoal,
          capabilityModule: task.capabilityModule,
          module: task.module,
          cycleType: task.cycleType,
          plannedDate: task.plannedDate,
          taskType: task.taskType,
          taskTypeTitle: taskType.title,
          track: task.track,
          baseXp: getTaskBaseXp(task),
          multiplier: getTaskMultiplier(getTaskTypeCount(task.taskType)),
          earnedXp: getTaskEarnedXp(task),
          canBecomeWork: task.canBecomeWork,
          status: "已完成",
          date: today,
          week,
          periodKey,
          completedAt: new Date().toISOString()
        },
        ...latestRecords
      ]);

      renderHero();
      renderProgress();
      renderTasks();
    });
  });

  const recentRecords = records.slice(0, 5);
  taskRecords.innerHTML = recentRecords.length
    ? recentRecords
        .map(
          (record) => `
            <article class="list-item">
              <div>
                <span>${record.date} / ${record.taskTypeTitle || record.module}</span>
                <h3>${record.title}</h3>
              </div>
              <strong class="task-xp">+${record.earnedXp ?? record.xp}</strong>
            </article>
          `
        )
        .join("")
    : `<p class="empty">完成今日推进后，这里会显示最近记录。</p>`;
};

const renderProgress = () => {
  const progressGrid = document.querySelector("#progressGrid");
  if (!progressGrid) return;

  progressGrid.innerHTML = data.tracks
    .map((track) => {
      const xp = getTrackXp(track.id);
      const percent = formatPercent(xp, track.targetXp);

      return `
        <article class="progress-card">
          <div class="card-heading">
            <span>${track.progressLabel}</span>
            <strong>${percent}%</strong>
          </div>
          <h3>${track.title}</h3>
          <div class="progress-track">
            <span class="progress-bar" style="width: ${percent}%"></span>
          </div>
          <p>${xp} / ${track.targetXp} 经验值</p>
        </article>
      `;
    })
    .join("");
};

const renderModules = () => {
  const moduleGrid = document.querySelector("#moduleGrid");
  if (!moduleGrid) return;

  moduleGrid.innerHTML = data.tracks
    .map((track) => {
      const completedCount = getTrackWorks(track.id).filter((work) => work.status === "已完成").length;

      return `
        <a class="module-card" href="${track.href}">
          <span>${track.progressLabel}</span>
          <h3>${track.title}</h3>
          <p>${track.description}</p>
          <strong>${completedCount} 项已完成</strong>
        </a>
      `;
    })
    .join("");
};

const renderRecentUpdates = () => {
  const recentUpdates = document.querySelector("#recentUpdates");
  if (!recentUpdates) return;

  recentUpdates.innerHTML = sortByDateDesc(data.works)
    .slice(0, 4)
    .map(
      (work) => `
        <article class="list-item">
          <div>
            <span>${work.date} / ${work.type}</span>
            <h3>${work.title}</h3>
          </div>
          <span class="status ${statusClass(work.status)}">${work.status}</span>
        </article>
      `
    )
    .join("");
};

const renderDashboardArchive = () => {
  const dashboardArchive = document.querySelector("#dashboardArchive");
  if (!dashboardArchive) return;

  dashboardArchive.innerHTML = sortByDateDesc(data.works)
    .slice(0, 5)
    .map(
      (work) => `
        <article class="list-item">
          <div>
            <span>${work.date} / ${work.type}</span>
            <h3>${work.title}</h3>
          </div>
          <span class="status ${statusClass(work.status)}">${work.status}</span>
        </article>
      `
    )
    .join("");
};

const renderFeaturedWorks = () => {
  const featuredWorks = document.querySelector("#featuredWorks");
  if (!featuredWorks) return;

  const works = data.works.filter((work) => work.featured).slice(0, 3);
  featuredWorks.innerHTML = works.map(workCard).join("");
};

const renderAbout = () => {
  const aboutIntro = document.querySelector("#aboutIntro");
  const aboutCards = document.querySelector("#aboutCards");
  if (!aboutIntro || !aboutCards) return;

  aboutIntro.textContent = data.profile.intro;
  aboutCards.innerHTML = data.profile.aboutCards
    .map(
      (card) => `
        <article class="info-card">
          <h3>${card.title}</h3>
          <p>${card.text}</p>
        </article>
      `
    )
    .join("");
};

const renderPortfolio = () => {
  const portfolioAbout = document.querySelector("#portfolioAbout");
  const portfolioDirections = document.querySelector("#portfolioDirections");
  const portfolioProjects = document.querySelector("#portfolioProjects");
  const portfolioWorks = document.querySelector("#portfolioWorks");
  const portfolioCases = document.querySelector("#portfolioCases");

  if (portfolioAbout) {
    portfolioAbout.innerHTML = data.profile.aboutCards
      .map(
        (card) => `
          <article class="info-card">
            <h3>${card.title}</h3>
            <p>${card.text}</p>
          </article>
        `
      )
      .join("");
  }

  if (portfolioDirections) {
    portfolioDirections.innerHTML = data.tracks
      .map(
        (track) => `
          <a class="module-card" href="${track.href}">
            <span>${track.progressLabel}</span>
            <h3>${track.title}</h3>
            <p>${track.description}</p>
          </a>
        `
      )
      .join("");
  }

  if (portfolioProjects) {
    portfolioProjects.innerHTML = data.portfolioProjects
      .map(
        (project) => `
          <article class="project-card">
            <div class="project-meta">
              <span>${project.type}</span>
              <span class="status active">${project.status}</span>
            </div>
            <h3>${project.title}</h3>
            <p>${project.summary}</p>
            <dl>
              <div>
                <dt>完成时间</dt>
                <dd>${project.completedAt}</dd>
              </div>
              <div>
                <dt>下一步</dt>
                <dd>${project.nextStep}</dd>
              </div>
            </dl>
          </article>
        `
      )
      .join("");
  }

  if (portfolioWorks) {
    const groups = [
      { title: "视频作品", types: ["视频作品"] },
      { title: "Codex 小工具", types: ["Codex 小工具"] },
      { title: "AIGC 实验", types: ["AIGC 创意实验"] }
    ];

    portfolioWorks.innerHTML = groups
      .map((group) => {
        const works = data.works.filter((work) => group.types.includes(work.type));
        const cards = works.length ? works.map(workCard).join("") : `<p class="empty">这里还没有归档作品。</p>`;

        return `
          <section class="work-group">
            <div class="work-group-title">
              <h3>${group.title}</h3>
              <span>${works.length} 项</span>
            </div>
            <div class="work-grid">${cards}</div>
          </section>
        `;
      })
      .join("");
  }

  if (portfolioCases) {
    const cases = data.works.filter((work) => work.isCaseStudy);
    portfolioCases.innerHTML = cases.length ? cases.map(workCard).join("") : `<p class="empty">完整案例会在这里展示。</p>`;
  }
};

const renderTrackPage = () => {
  const track = getTrack(currentTrackId);
  const trackSummary = document.querySelector("#trackSummary");
  const trackWorks = document.querySelector("#trackWorks");
  if (!track || !trackSummary || !trackWorks) return;

  const works = sortByDateDesc(getTrackWorks(track.id));
  const xp = getTrackXp(track.id);
  const percent = formatPercent(xp, track.targetXp);

  trackSummary.innerHTML = `
    <article class="hero-panel compact-panel">
      <div class="panel-topline">
        <span>${track.progressLabel}</span>
        <strong>${percent}%</strong>
      </div>
      <div class="progress-track">
        <span class="progress-bar" style="width: ${percent}%"></span>
      </div>
      <p>${xp} / ${track.targetXp} 经验值，${works.length} 条记录</p>
    </article>
  `;

  trackWorks.innerHTML = works.length ? works.map(workCard).join("") : `<p class="empty">这里还没有归档作品。</p>`;
};

const renderArchive = () => {
  const archiveRows = document.querySelector("#archiveRows");
  if (!archiveRows) return;

  archiveRows.innerHTML = sortByDateDesc(data.works)
    .map(
      (work) => `
        <tr>
          <td>${work.date}</td>
          <td>${work.title}</td>
          <td>${work.type}</td>
          <td>${work.description}</td>
          <td>+${getWorkXp(work)}</td>
          <td><span class="status ${statusClass(work.status)}">${work.status}</span></td>
        </tr>
      `
    )
    .join("");
};

initGalaxyBackground();

if (page === "landing") {
  initIntro();
}

if (page === "dashboard") {
  renderHero();
  renderProgress();
  renderTasks();
  renderModules();
  renderRecentUpdates();
  renderFeaturedWorks();
  renderDashboardArchive();
}

if (page === "portfolio") {
  renderPortfolio();
}

if (page === "about") {
  renderAbout();
}

if (page === "track") {
  renderTrackPage();
}

if (page === "archive") {
  renderArchive();
}
