(function () {
  const deck = { ...(window.PITCH_CONFIG || {}), slides: window.PITCH_SLIDES };
  if (!Array.isArray(deck.slides)) throw new Error("PITCH_SLIDES is required");

  const artifact = document.querySelector(".artifact");
  const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);

  function renderBody(slide) {
    const text = (value) => escapeHtml(value);
    if (slide.layout === "cover") return `
      <div class="cover-copy hero">
        <div class="project-chip">${text(deck.project)}</div>
        <h1 data-qa-fit>${text(slide.claim)}</h1>
        <p>${text(slide.support)}</p>
      </div>
      <div class="cover-mark" data-qa-fit aria-hidden="true"><span></span><span></span><span></span></div>`;

    if (slide.layout === "metric") return `
      <div class="headline hero"><h2 data-qa-fit>${text(slide.claim)}</h2></div>
      <div class="metric-stage hero" data-qa-fit>
        <strong data-count-value>${text(slide.metric)}</strong>
        <span>${text(slide.metricLabel)}</span>
        <p>${text(slide.note)}</p>
      </div>
      <div class="source-line">${text(slide.source)}</div>`;

    if (slide.layout === "contrast") return `
      <div class="headline hero"><h2 data-qa-fit>${text(slide.claim)}</h2></div>
      <div class="contrast-grid hero">
        ${[slide.left, slide.right].map((side, index) => `
          <article class="contrast-card ${index ? "is-accent" : ""}" data-qa-fit>
            <small>${text(side.label)}</small><strong>${text(side.value)}</strong><p>${text(side.detail)}</p>
          </article>`).join("")}
      </div>`;

    if (slide.layout === "steps") return `
      <div class="headline hero"><h2 data-qa-fit>${text(slide.claim)}</h2></div>
      <div class="step-grid hero">
        ${slide.steps.map((step) => `<article class="step" data-qa-fit><b>${text(step.number)}</b><h3>${text(step.title)}</h3><p>${text(step.detail)}</p></article>`).join("")}
      </div>`;

    if (slide.layout === "product") return `
      <div class="headline product-head hero"><h2 data-qa-fit>${text(slide.claim)}</h2></div>
      <div class="product-grid hero">
        <section class="product-frame" data-qa-fit>
          <header><span>${text(slide.productLabel)}</span><b>${text(slide.focus)}</b></header>
          <div class="product-table">
            ${slide.rows.map((row) => `<div><strong>${text(row.name)}</strong><span class="state state-${text(row.state).toLowerCase()}">${text(row.state)}</span><em>${text(row.value)}</em></div>`).join("")}
          </div>
        </section>
        <ol class="product-points">${slide.bullets.map((bullet, index) => `<li data-qa-fit><b>0${index + 1}</b><span>${text(bullet)}</span></li>`).join("")}</ol>
      </div>`;

    if (slide.layout === "growth") return `
      <div class="headline hero"><h2 data-qa-fit>${text(slide.claim)}</h2></div>
      <div class="growth-grid hero">
        <div class="growth-metric" data-qa-fit><strong>${text(slide.metric)}</strong><span>${text(slide.metricLabel)}</span></div>
        <div class="growth-path" data-qa-fit>${slide.stages.map((stage, index) => `<div><b>0${index + 1}</b><span>${text(stage)}</span></div>`).join("")}</div>
      </div>
      <div class="source-line source-dark">${text(slide.source)}</div>`;

    if (slide.layout === "team") return `
      <div class="headline hero"><h2 data-qa-fit>${text(slide.claim)}</h2></div>
      <div class="team-grid hero">
        ${slide.members.map((member) => `<figure class="member" data-qa-fit><div>${text(member.initials)}</div><figcaption><small>${text(member.role)}</small><strong>${text(member.proof)}</strong></figcaption></figure>`).join("")}
      </div><div class="team-footer">${text(slide.footer)}</div>`;

    if (slide.layout === "api") return `
      <div class="headline hero"><h2 data-qa-fit>${text(slide.claim)}</h2></div>
      <div class="api-list hero">
        ${slide.endpoints.map((endpoint) => `<article class="api-row" data-qa-fit><b>${text(endpoint.method)}</b><code>${text(endpoint.path)}</code><span>${text(endpoint.role)}</span></article>`).join("")}
      </div>`;

    if (slide.layout === "architecture") return `
      <div class="headline hero"><h2 data-qa-fit>${text(slide.claim)}</h2></div>
      <div class="architecture-grid hero" data-qa-fit>
        ${slide.layers.map((layer, index) => `<section class="architecture-layer"><small>${text(layer.label)}</small>${layer.items.map((item) => `<strong>${text(item)}</strong>`).join("")}${index < slide.layers.length - 1 ? '<svg data-artifact-icon viewBox="0 0 80 24" aria-hidden="true"><path d="M2 12h69M62 3l9 9-9 9"/></svg>' : ""}</section>`).join("")}
      </div>`;

    if (slide.layout === "purpose") return `
      <div class="purpose-copy hero">
        <h2 data-qa-fit>${text(slide.claim)}</h2>
        <div class="purpose-stack">${slide.reasons.map((reason) => `<div data-qa-fit><b>${text(reason.number)}</b><span>${text(reason.text)}</span></div>`).join("")}</div>
        <p>${text(slide.label)}</p>
      </div>`;

    if (slide.layout === "closing") return `
      <div class="closing-copy hero">
        <h2 data-qa-fit>${text(slide.claim)}</h2>
        <div class="reason-row" data-qa-fit>${slide.reasons.map((reason, index) => `<span><b>0${index + 1}</b>${text(reason)}</span>`).join("")}</div>
        <p>${text(slide.action)}</p>
      </div>`;

    throw new Error(`Unknown layout: ${slide.layout}`);
  }

  artifact.innerHTML = deck.slides.map((slide, index) => `
    <section class="artifact-page layout-${escapeHtml(slide.layout)} tone-${escapeHtml(slide.tone)}${index === 0 ? " is-active" : ""}"
      data-page-id="${escapeHtml(slide.id)}" data-page-number="${index + 1}" aria-label="Slide ${index + 1}">
      <div class="meta">${escapeHtml(slide.meta)}</div>
      <div class="page-number">${String(index + 1).padStart(2, "0")} / ${String(deck.slides.length).padStart(2, "0")}</div>
      ${renderBody(slide)}
    </section>`).join("");

  const pages = [...document.querySelectorAll(".artifact-page")];
  const status = document.querySelector("[data-page-status]");
  let current = 0;

  function show(index) {
    current = Math.max(0, Math.min(pages.length - 1, index));
    pages.forEach((page, pageIndex) => page.classList.toggle("is-active", pageIndex === current));
    status.textContent = `${current + 1} / ${pages.length}`;
    if (!document.documentElement.dataset.artifactExport) history.replaceState(null, "", `#${current + 1}`);
  }

  document.querySelector('[data-action="previous"]').addEventListener("click", () => show(current - 1));
  document.querySelector('[data-action="next"]').addEventListener("click", () => show(current + 1));
  document.addEventListener("keydown", (event) => {
    if (["ArrowRight", "PageDown", " "].includes(event.key)) show(current + 1);
    if (["ArrowLeft", "PageUp"].includes(event.key)) show(current - 1);
  });

  const initialPage = Number(location.hash.slice(1)) - 1;
  show(Number.isInteger(initialPage) && initialPage >= 0 ? initialPage : 0);

  window.prepareForExport = async function prepareForExport() {
    document.documentElement.dataset.artifactExport = "true";
    pages.forEach((page) => page.classList.add("is-export-ready"));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    for (const animation of document.getAnimations()) {
      const iterations = animation.effect?.getTiming?.().iterations;
      if (Number.isFinite(iterations)) {
        try { animation.finish(); } catch { animation.cancel(); }
      } else animation.cancel();
    }
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode?.().catch(() => {})));
  };
})();
