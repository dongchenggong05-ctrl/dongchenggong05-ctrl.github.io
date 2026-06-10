/* San — AI Creative Builder
   读取 data.json 并渲染整个页面。只有这一份脚本文件。 */

const text = (id, value) => {
  document.getElementById(id).textContent = value;
};

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
