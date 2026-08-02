(() => {
  const data = window.MEDDRA_GLOSSARY;
  const morph = window.MORPH_LINKS;
  const glossaryImages = window.GLOSSARY_IMAGES?.byTerm || {};
  const root = document.getElementById("glossary-list");
  const search = document.getElementById("glossary-search");
  const count = document.getElementById("glossary-count");
  const source = document.getElementById("glossary-source");
  const modal = document.getElementById("glossary-image-modal");
  const modalTitle = document.getElementById("glossary-modal-title");
  const modalImg = document.getElementById("glossary-modal-img");
  const modalCap = document.getElementById("glossary-modal-caption");
  if (!data || !root) return;

  if (source) {
    const parts = [data.source, window.GLOSSARY_IMAGES?.note].filter(Boolean);
    source.textContent = parts.join(" ");
  }

  const terms = [...(data.terms || [])];

  function imageFor(term) {
    return glossaryImages[term.toLowerCase()] || null;
  }

  function openImageModal(term, shot) {
    if (!modal || !modalImg) return;
    modalTitle.textContent = term;
    modalImg.src = shot.url;
    modalImg.alt = shot.caption || term;
    const creditBits = [shot.credit, shot.license].filter(Boolean).join(" — ");
    modalCap.innerHTML = "";
    const cap = document.createElement("p");
    cap.textContent = shot.caption || "";
    modalCap.appendChild(cap);
    if (creditBits) {
      const cred = document.createElement("p");
      cred.className = "glossary-modal-credit";
      if (shot.sourcePage) {
        const a = document.createElement("a");
        a.href = shot.sourcePage;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = creditBits;
        cred.appendChild(a);
      } else {
        cred.textContent = creditBits;
      }
      modalCap.appendChild(cred);
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

      if (lesionId && morph) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "morph-term glossary-morph-term";
        btn.dataset.lesionId = lesionId;
        btn.setAttribute("aria-describedby", "morph-popover");
        btn.textContent = term;
        li.appendChild(btn);
      } else if (shot) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "morph-term glossary-morph-term glossary-image-term";
        btn.textContent = term;
        btn.title = "View reference image";
        btn.addEventListener("click", () => openImageModal(term, shot));
        li.appendChild(btn);
      } else {
        li.textContent = term;
      }

      root.appendChild(li);
    });

    morph?.bindTermInteractions?.(root);

    if (count) {
      count.textContent =
        list.length === terms.length
          ? `${list.length} terms`
          : `${list.length} of ${terms.length} terms`;
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
