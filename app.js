(() => {
  const data = window.LESION_DATA;
  if (!data) {
    console.error("LESION_DATA not loaded");
    return;
  }

  const evaluationRoot = document.getElementById("evaluation-cards");
  const primaryRoot = document.getElementById("primary-list");
  const secondaryRoot = document.getElementById("secondary-list");
  const templateRoot = document.getElementById("template-block");
  const disclaimer = document.getElementById("disclaimer");
  const modal = document.getElementById("image-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalGallery = document.getElementById("modal-gallery");

  const PLACEHOLDER_SVG =
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'>
        <rect width='100%' height='100%' fill='%230f172a'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='system-ui,sans-serif' font-size='20'>No figure / unavailable</text>
      </svg>`
    );

  function bindImageFallback(img) {
    img.addEventListener("error", () => {
      img.src = PLACEHOLDER_SVG;
    });
  }

  function renderEvaluation() {
    evaluationRoot.innerHTML = "";
    data.evaluationSections.forEach((section) => {
      const card = document.createElement("article");
      card.className = "eval-card";
      card.id = section.id;
      const heading = section.href
        ? `<h3><a class="eval-card-link" href="${section.href}">${section.heading}</a></h3>`
        : `<h3>${section.heading}</h3>`;
      card.innerHTML = `${heading}<p>${section.body}</p>`;
      evaluationRoot.appendChild(card);
    });
  }

  function diagramPathFor(entry) {
    const ref = window.PSK_REFERENCE;
    if (ref && typeof ref.diagramPathForId === "function") {
      return ref.diagramPathForId(entry.id);
    }
    return "assets/bolognia-crops/_default.png";
  }

  function buildFlipFigureBlock(entry, primaryImg) {
    const flipRoot = document.createElement("div");
    flipRoot.className = "figure-flip";

    const inner = document.createElement("div");
    inner.className = "figure-flip-inner";

    const front = document.createElement("div");
    front.className = "figure-face figure-face--front";
    const photo = document.createElement("img");
    photo.className = "figure-flip-photo";
    photo.src = primaryImg.url;
    photo.alt = primaryImg.caption || `Clinical photograph: ${entry.term}`;
    photo.loading = "eager";
    photo.decoding = "async";
    bindImageFallback(photo);
    front.appendChild(photo);

    const back = document.createElement("div");
    back.className = "figure-face figure-face--back";
    back.setAttribute("aria-hidden", "true");
    const diag = document.createElement("img");
    diag.className = "figure-flip-diagram";
    diag.src = diagramPathFor(entry);
    diag.alt = "";
    diag.setAttribute("role", "presentation");
    diag.loading = "eager";
    diag.decoding = "async";
    if (window.PSK_REFERENCE?.usesGraphicImage?.(entry.id)) {
      diag.classList.add("figure-flip-diagram--natural");
    }
    const defPath = window.PSK_REFERENCE?.defaultDiagramPath || "assets/bolognia-crops/_default.png";
    diag.addEventListener("error", () => {
      if (diag.src.indexOf("_default") === -1) diag.src = defPath;
      else diag.src = PLACEHOLDER_SVG;
    });
    back.appendChild(diag);

    inner.appendChild(front);
    inner.appendChild(back);
    flipRoot.appendChild(inner);

    const toolbar = document.createElement("div");
    toolbar.className = "figure-flip-toolbar";
    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "figure-flip-toggle btn btn-ghost";

    function setFlipped(flipped) {
      flipRoot.classList.toggle("is-flipped", flipped);
      toggleBtn.setAttribute("aria-expanded", flipped ? "true" : "false");
      toggleBtn.textContent = flipped ? "Show clinical photograph" : "Show line drawing";
      front.setAttribute("aria-hidden", flipped ? "true" : "false");
      back.setAttribute("aria-hidden", flipped ? "false" : "true");
    }

    setFlipped(false);
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      setFlipped(!flipRoot.classList.contains("is-flipped"));
    });
    toolbar.appendChild(toggleBtn);
    flipRoot.appendChild(toolbar);

    return { wrap: flipRoot };
  }

  function buildAtlasCaptionBox(primary) {
    const cap = (primary.caption || "").trim();
    if (!cap) return null;

    const box = document.createElement("aside");
    box.className = "atlas-caption-box";
    const main = document.createElement("p");
    main.className = "atlas-caption-text";
    main.textContent = cap;
    box.appendChild(main);
    return box;
  }

  function fillCitation(el, cred) {
    const trimmed = cred.trim();
    const urlOnly = /^https?:\/\/\S+$/i.test(trimmed);
    if (urlOnly) {
      const a = document.createElement("a");
      a.href = trimmed;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = trimmed;
      el.appendChild(a);
      return;
    }
    el.textContent = trimmed;
  }

  function openGallery(entry, allImages) {
    modalTitle.textContent = `${entry.term} — image gallery`;
    modalGallery.innerHTML = "";
    const citeOnHover = data.primaryLesions.some((item) => item.id === entry.id);
    allImages.forEach((shot) => {
      const fig = document.createElement("figure");
      fig.className = "modal-figure";
      const media = document.createElement("div");
      media.className = "modal-figure-media";
      const img = document.createElement("img");
      img.src = shot.url;
      img.alt = shot.caption || entry.term;
      bindImageFallback(img);
      media.appendChild(img);
      const cred = (shot.credit || "").trim();
      if (citeOnHover && cred) {
        const tip = document.createElement("p");
        tip.className = "modal-cite-hover";
        fillCitation(tip, cred);
        media.tabIndex = 0;
        media.setAttribute("aria-label", `Citation: ${cred}`);
        media.appendChild(tip);
      }
      fig.appendChild(media);
      const cap = document.createElement("figcaption");
      cap.className = "modal-caption";
      cap.textContent = shot.caption || "";
      fig.appendChild(cap);
      modalGallery.appendChild(fig);
    });
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector(".modal-close").focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  modal.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLElement && target.dataset.close === "true") {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });

  function renderLesionCard(entry, root) {
    const card = document.createElement("article");
    card.className = "lesion-card";
    card.id = entry.id;
    card.dataset.lesionCard = entry.id;

    const primary = entry.images[0] || {
      url: PLACEHOLDER_SVG,
      caption: "No figure placed in the atlas workbook for this entry.",
      credit: "",
      license: "",
    };
    const { wrap } = buildFlipFigureBlock(entry, primary);

    const body = document.createElement("div");
    body.className = "lesion-body";
    body.innerHTML = `<h3>${entry.term}</h3>`;

    const def = document.createElement("p");
    def.className = "term-def";
    def.textContent = entry.definition;
    body.appendChild(def);

    const captionBox = buildAtlasCaptionBox(primary);
    if (captionBox) body.appendChild(captionBox);

    const actions = document.createElement("div");
    actions.className = "figure-actions";

    const combined = [...(entry.images || []), ...(entry.gallery || [])];
    const galleryBtn = document.createElement("button");
    galleryBtn.type = "button";
    galleryBtn.className = "btn";
    if (combined.length === 0) {
      galleryBtn.textContent = "No images";
      galleryBtn.disabled = true;
    } else if (combined.length === 1) {
      galleryBtn.textContent = "Open image details";
      galleryBtn.addEventListener("click", () => openGallery(entry, combined));
    } else {
      galleryBtn.textContent = `More images (${combined.length})`;
      galleryBtn.addEventListener("click", () => openGallery(entry, combined));
    }
    actions.appendChild(galleryBtn);

    body.appendChild(actions);
    card.appendChild(wrap);
    card.appendChild(body);
    root.appendChild(card);
  }

  function renderLesions(list, root) {
    root.innerHTML = "";
    list.forEach((item) => renderLesionCard(item, root));
  }

  function renderTemplate() {
    const block = data.documentationTemplate;
    templateRoot.innerHTML = "";
    block.lines.forEach((line) => {
      const p = document.createElement("p");
      p.textContent = line;
      templateRoot.appendChild(p);
    });
  }

  disclaimer.textContent = data.meta.disclaimer;

  renderEvaluation();
  renderLesions(data.primaryLesions, primaryRoot);
  renderLesions(data.secondaryLesions, secondaryRoot);
  renderTemplate();
})();
