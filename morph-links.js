(() => {
  const lesionData = window.LESION_DATA;
  if (!lesionData) return;

  const popover = document.getElementById("morph-popover");
  if (!popover) return;

  const popoverImg = popover.querySelector(".morph-popover-img");
  const popoverTerm = popover.querySelector(".morph-popover-term");
  const popoverDef = popover.querySelector(".morph-popover-def");

  const PLACEHOLDER_SVG =
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200' viewBox='0 0 320 200'>
        <rect width='100%' height='100%' fill='%230f172a'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='system-ui,sans-serif' font-size='14'>No figure</text>
      </svg>`
    );

  const lesionById = new Map();
  [...lesionData.primaryLesions, ...lesionData.secondaryLesions].forEach((entry) => {
    lesionById.set(entry.id.toLowerCase(), entry);
  });

  const ALIASES = [
    ["sterile abscess", "abscess"],
    ["abscess sterile", "abscess"],
    ["ulceration", "ulcer"],
    ["phlebitis", "phlebitis"],
    ["thrombophlebitis", "phlebitis"],
    ["erythema", "erythema"],
    ["redness", "erythema"],
    ["redness and warming of", "erythema"],
    ["joint erythema", "erythema"],
    ["joint redness", "erythema"],
    ["vascular redness", "erythema"],
    ["necrosis", "necrosis"],
    ["fat necrosis", "necrosis"],
    ["slough", "necrosis"],
    ["edema", "edema"],
    ["swelling", "edema"],
    ["joint swelling", "edema"],
    ["induration", "induration"],
    ["painful induration", "induration"],
    ["abscess", "abscess"],
    ["ecchymosis", "ecchymosis"],
    ["bruising", "ecchymosis"],
    ["bleeding", "ecchymosis"],
    ["bleeding spot", "ecchymosis"],
    ["hematoma", "ecchymosis"],
    ["hemorrhage", "ecchymosis"],
    ["petechiae", "ecchymosis"],
    ["macule", "macule"],
    ["patch", "patch"],
    ["papule", "papule"],
    ["plaque", "plaque"],
    ["nodule", "nodule"],
    ["lump", "nodule"],
    ["mass", "nodule"],
    ["redness mass", "nodule"],
    ["ulcer", "ulcer"],
    ["pustule", "pustule"],
    ["vesicle", "vesicle"],
    ["vesicles", "vesicle"],
    ["vesicles at", "vesicle"],
    ["blisters", "vesicle"],
    ["bullous eruption at", "bulla"],
    ["bulla", "bulla"],
    ["atrophy", "atrophy"],
    ["fat atrophy", "atrophy"],
    ["muscle atrophy", "atrophy"],
    ["lipoatrophy", "atrophy"],
    ["lipodystrophy", "atrophy"],
    ["subcutaneous fat decreased", "atrophy"],
    ["crust", "crust"],
    ["scab", "crust"],
    ["scabbing", "crust"],
    ["desquamation", "crust"],
    ["exfoliation", "crust"],
    ["erosion", "erosion"],
    ["excoriation", "erosion"],
    ["abrasion", "erosion"],
    ["scar", "scar"],
    ["keloid", "scar"],
    ["fibrosis", "scar"],
    ["sclerosis", "scar"],
    ["drainage", "drainage"],
    ["leaking", "drainage"],
    ["discharge", "drainage"],
    ["hyperpigmentation", "hyperpigmentation"],
    ["hypopigmentation", "hypopigmentation"],
    ["leukoderma", "hypopigmentation"],
    ["discoloration", "color"],
    ["pigmentation changes", "color"],
    ["coloration", "color"],
    ["annular", "annular"],
    ["urticaria", "papule"],
    ["hives", "papule"],
    ["wheal", "papule"],
    ["rash", "erythema"],
    ["rash at site of injection", "erythema"],
    ["inflammation", "erythema"],
    ["irritation", "erythema"],
    ["warmth", "erythema"],
    ["joint warmth", "erythema"],
    ["vascular warmth", "erythema"],
    ["hyperemia", "erythema"],
    ["lipohypertrophy", "nodule"],
    ["subcutaneous fatty hypertrophy", "nodule"],
    ["hypertrophy", "nodule"],
    ["granuloma", "nodule"],
    ["cyst", "nodule"],
    ["indentation", "atrophy"],
  ].filter(([_, id]) => lesionById.has(id));

  const lesionIdsByLength = [...lesionById.keys()].sort((a, b) => b.length - a.length);

  function resolveLesionId(phrase) {
    const key = phrase.trim().toLowerCase();
    if (!key) return null;

    if (lesionById.has(key)) return key;

    for (const [alias, id] of ALIASES) {
      if (key === alias.toLowerCase()) return id;
    }

    for (const entry of lesionById.values()) {
      if (entry.term?.toLowerCase() === key) return entry.id;
    }

    for (const id of lesionIdsByLength) {
      const re = new RegExp(`\\b${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (re.test(key)) return id;
    }

    return null;
  }

  const patterns = ALIASES.map(([phrase, id]) => ({
    re: new RegExp(`\\b(${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`, "gi"),
    id,
  }));

  let hoverTimer = null;
  let popoverListenersBound = false;

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function lesionImage(entry) {
    const shot = entry.images?.[0] || entry.gallery?.[0];
    return shot?.url || PLACEHOLDER_SVG;
  }

  function linkMorphologyTerms(text) {
    if (!text) return "";
    const spans = [];
    let cursor = 0;
    const matches = [];

    patterns.forEach(({ re, id }) => {
      const copy = new RegExp(re.source, re.flags);
      let m;
      while ((m = copy.exec(text)) !== null) {
        matches.push({ start: m.index, end: m.index + m[0].length, text: m[0], id });
      }
    });

    matches.sort((a, b) => a.start - b.start || b.end - a.end);
    const chosen = [];
    for (const m of matches) {
      if (chosen.some((c) => !(m.end <= c.start || m.start >= c.end))) continue;
      chosen.push(m);
    }
    chosen.sort((a, b) => a.start - b.start);

    chosen.forEach((m) => {
      if (m.start > cursor) spans.push(escapeHtml(text.slice(cursor, m.start)));
      if (!lesionById.has(m.id)) {
        spans.push(escapeHtml(m.text));
        cursor = m.end;
        return;
      }
      spans.push(
        `<button type="button" class="morph-term" data-lesion-id="${m.id}" aria-describedby="morph-popover">${escapeHtml(m.text)}</button>`
      );
      cursor = m.end;
    });
    if (cursor < text.length) spans.push(escapeHtml(text.slice(cursor)));
    return spans.join("") || escapeHtml(text);
  }

  function showPopover(trigger, lesionId) {
    const entry = lesionById.get(lesionId);
    if (!entry) return;

    popoverTerm.textContent = entry.term;
    popoverDef.textContent = entry.definition;
    popoverImg.src = lesionImage(entry);
    popoverImg.alt = entry.term;
    popover.hidden = false;

    const rect = trigger.getBoundingClientRect();
    const pad = 12;
    let left = rect.left + rect.width / 2;
    let top = rect.bottom + pad;

    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
    popover.style.transform = "translate(-50%, 0)";

    requestAnimationFrame(() => {
      const box = popover.getBoundingClientRect();
      if (box.right > window.innerWidth - pad) {
        left -= box.right - (window.innerWidth - pad);
      }
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

  function hidePopover() {
    popover.hidden = true;
  }

  function ensurePopoverListeners() {
    if (popoverListenersBound) return;
    popoverListenersBound = true;
    popover.addEventListener("mouseenter", () => clearTimeout(hoverTimer));
    popover.addEventListener("mouseleave", hidePopover);
  }

  function bindTermInteractions(root) {
    ensurePopoverListeners();
    root.querySelectorAll(".morph-term").forEach((btn) => {
      if (btn.dataset.morphBound === "true") return;
      // Glossary cited-image terms manage their own hover/click popover + modal.
      if (!btn.dataset.lesionId || btn.classList.contains("glossary-image-term")) return;
      btn.dataset.morphBound = "true";

      btn.addEventListener("mouseenter", () => {
        clearTimeout(hoverTimer);
        showPopover(btn, btn.dataset.lesionId);
      });
      btn.addEventListener("mouseleave", () => {
        hoverTimer = setTimeout(() => {
          if (!popover.matches(":hover")) hidePopover();
        }, 120);
      });
      btn.addEventListener("focus", () => showPopover(btn, btn.dataset.lesionId));
      btn.addEventListener("blur", () => {
        setTimeout(() => {
          if (!root.contains(document.activeElement) && !popover.contains(document.activeElement)) {
            hidePopover();
          }
        }, 0);
      });
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const id = btn.dataset.lesionId;
        const atlasHome = document.body.getAttribute("data-atlas-home");
        const target = document.getElementById(id) || document.querySelector(`[data-lesion-card="${id}"]`);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        if (atlasHome) {
          window.location.assign(`${atlasHome}#${id}`);
          return;
        }
        const inSecondary = lesionData.secondaryLesions.some((entry) => entry.id === id);
        document.getElementById(inSecondary ? "secondary" : "primary")?.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  window.MORPH_LINKS = { linkMorphologyTerms, bindTermInteractions, escapeHtml, resolveLesionId };
})();
