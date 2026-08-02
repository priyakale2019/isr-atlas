(() => {
  const data = window.MEDDRA_GLOSSARY;
  const morph = window.MORPH_LINKS;
  const glossaryImages = window.GLOSSARY_IMAGES?.byTerm || {};
  const root = document.getElementById("glossary-list");
  const search = document.getElementById("glossary-search");
  const count = document.getElementById("glossary-count");
  const source = document.getElementById("glossary-source");
  const sourcesList = document.getElementById("glossary-image-sources");
  const modal = document.getElementById("glossary-image-modal");
  const modalTitle = document.getElementById("glossary-modal-title");
  const modalImg = document.getElementById("glossary-modal-img");
  const modalCap = document.getElementById("glossary-modal-caption");
  const popover = document.getElementById("morph-popover");
  const popoverImg = popover?.querySelector(".morph-popover-img");
  const popoverTerm = popover?.querySelector(".morph-popover-term");
  const popoverDef = popover?.querySelector(".morph-popover-def");
  if (!data || !root) return;

  if (source) {
    const parts = [data.source, window.GLOSSARY_IMAGES?.note].filter(Boolean);
    source.textContent = parts.join(" ");
  }

  if (sourcesList && window.GLOSSARY_IMAGES?.sources?.length) {
    sourcesList.innerHTML = "";
    const heading = document.createElement("p");
    heading.className = "glossary-sources-heading";
    heading.textContent = "Image source sites";
    sourcesList.appendChild(heading);
    const ul = document.createElement("ul");
    ul.className = "glossary-sources-list";
    window.GLOSSARY_IMAGES.sources.forEach((s) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = s.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = s.site;
      li.appendChild(a);
      if (s.note) {
        li.appendChild(document.createTextNode(` — ${s.note}`));
      }
      ul.appendChild(li);
    });
    sourcesList.appendChild(ul);
  }

  const terms = [...(data.terms || [])];
  let hideTimer = null;

  function imageFor(term) {
    return glossaryImages[term.toLowerCase()] || null;
  }

  function placePopover(anchor) {
    if (!popover) return;
    const rect = anchor.getBoundingClientRect();
    const pad = 12;
    let left = rect.left + rect.width / 2;
    let top = rect.bottom + pad;
    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
    popover.style.transform = "translate(-50%, 0)";

    requestAnimationFrame(() => {
      const box = popover.getBoundingClientRect();
      if (box.right > window.innerWidth - pad) left -= box.right - (window.innerWidth - pad);
      if (box.left < pad) left += pad - box.left;
      if (box.bottom > window.innerHeight - pad) {
        top = rect.top - pad;
        popover.style.transform = "translate(-50%, -100%)";
      } else {
        popover.style.transform = "translate(-50%, 0)";
      }
      popover.style.left = `${left}px`;
      popover.style.top = `${top}px`;
    });
  }

  function showImageHover(anchor, term, shot) {
    if (!popover || !popoverImg || !popoverTerm || !popoverDef) return;
    clearTimeout(hideTimer);
    popoverTerm.textContent = term;
    const citeBits = [shot.caption, shot.credit, shot.license, shot.sourceSite]
      .filter(Boolean)
      .join(" · ");
    popoverDef.textContent = citeBits;
    popoverImg.src = shot.url;
    popoverImg.alt = shot.caption || term;
    popover.hidden = false;
    placePopover(anchor);
  }

  function hideImageHover() {
    hideTimer = setTimeout(() => {
      if (popover && !popover.matches(":hover")) popover.hidden = true;
    }, 120);
  }

  if (popover) {
    popover.addEventListener("mouseenter", () => clearTimeout(hideTimer));
    popover.addEventListener("mouseleave", () => {
      popover.hidden = true;
    });
  }

  function openImageModal(term, shot) {
    if (!modal || !modalImg) return;
    if (popover) popover.hidden = true;
    modalTitle.textContent = term;
    modalImg.src = shot.url;
    modalImg.alt = shot.caption || term;
    modalCap.innerHTML = "";

    if (shot.caption) {
      const cap = document.createElement("p");
      cap.textContent = shot.caption;
      modalCap.appendChild(cap);
    }

    const cite = document.createElement("p");
    cite.className = "glossary-modal-credit";
    const bits = [];
    if (shot.credit) bits.push(`Credit: ${shot.credit}`);
    if (shot.license) bits.push(`License: ${shot.license}`);
    cite.textContent = bits.join(" · ");
    modalCap.appendChild(cite);

    if (shot.sourceSite || shot.sourcePage) {
      const siteLine = document.createElement("p");
      siteLine.className = "glossary-modal-source";
      siteLine.appendChild(document.createTextNode("Source site: "));
      if (shot.sourcePage) {
        const a = document.createElement("a");
        a.href = shot.sourcePage;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = shot.sourceSite || shot.sourcePage;
        siteLine.appendChild(a);
      } else {
        siteLine.appendChild(document.createTextNode(shot.sourceSite));
      }
      modalCap.appendChild(siteLine);
    }

    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector(".modal-close")?.focus();
  }

  function closeImageModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      const target = e.target;
      if (target instanceof HTMLElement && target.dataset.close === "true") {
        closeImageModal();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeImageModal();
    });
  }

  function render(list) {
    root.innerHTML = "";
    list.forEach((term) => {
      const li = document.createElement("li");
      li.className = "glossary-term";
      const lesionId = morph?.resolveLesionId?.(term);
      const shot = imageFor(term);

      if (shot) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "morph-term glossary-morph-term glossary-image-term";
        btn.textContent = term;
        btn.title = "Hover for image · click for full citation";
        btn.setAttribute("aria-describedby", "morph-popover");
        btn.addEventListener("mouseenter", () => showImageHover(btn, term, shot));
        btn.addEventListener("mouseleave", hideImageHover);
        btn.addEventListener("focus", () => showImageHover(btn, term, shot));
        btn.addEventListener("blur", hideImageHover);
        btn.addEventListener("click", () => openImageModal(term, shot));
        li.appendChild(btn);
      } else if (lesionId && morph) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "morph-term glossary-morph-term";
        btn.dataset.lesionId = lesionId;
        btn.setAttribute("aria-describedby", "morph-popover");
        btn.textContent = term;
        li.appendChild(btn);
      } else {
        li.textContent = term;
      }

      root.appendChild(li);
    });

    morph?.bindTermInteractions?.(root);

    if (count) {
      const withImages = list.filter((t) => imageFor(t)).length;
      count.textContent =
        list.length === terms.length
          ? `${list.length} terms · ${Object.keys(glossaryImages).length} with cited images`
          : `${list.length} of ${terms.length} terms · ${withImages} with cited images`;
    }
  }

  render(terms);

  if (search) {
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      if (!q) {
        render(terms);
        return;
      }
      render(terms.filter((t) => t.toLowerCase().includes(q)));
    });
  }
})();
