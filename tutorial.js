(() => {
  const DEFINITIONS = {
    primary: {
      title: "Primary morphology",
      body:
        "The fundamental lesion type—the morphology you would see if the process were fresh and uncomplicated by secondary change. Choose the single best-fitting primary term when possible.",
    },
    secondary: {
      title: "Secondary morphology",
      body:
        "Surface changes superimposed on the primary lesion like scale, crust, erosion, ulceration, fissuring, excoriation, lichenification, or other changes from healing, trauma, or secondary infection.",
    },
  };

  const popover = document.getElementById("tutorial-popover");
  if (!popover) return;

  const termEl = popover.querySelector(".tutorial-popover-term");
  const defEl = popover.querySelector(".tutorial-popover-def");
  const links = document.querySelectorAll(".tutorial-morph");
  let hideTimer = null;

  function placePopover(anchor) {
    const rect = anchor.getBoundingClientRect();
    const pad = 10;
    const width = popover.offsetWidth || 280;
    let left = rect.left + rect.width / 2 - width / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - width - 12));
    let top = rect.bottom + pad;
    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;

    const box = popover.getBoundingClientRect();
    if (box.bottom > window.innerHeight - 8) {
      popover.style.top = `${Math.max(8, rect.top - box.height - pad)}px`;
    }
  }

  function showPopover(anchor) {
    const kind = anchor.dataset.morph;
    const info = DEFINITIONS[kind];
    if (!info) return;
    clearTimeout(hideTimer);
    termEl.textContent = info.title;
    defEl.textContent = info.body;
    popover.hidden = false;
    placePopover(anchor);
  }

  function hidePopover() {
    hideTimer = setTimeout(() => {
      popover.hidden = true;
    }, 120);
  }

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => showPopover(link));
    link.addEventListener("mouseleave", hidePopover);
    link.addEventListener("focus", () => showPopover(link));
    link.addEventListener("blur", hidePopover);
  });

  popover.addEventListener("mouseenter", () => clearTimeout(hideTimer));
  popover.addEventListener("mouseleave", hidePopover);

  window.addEventListener(
    "scroll",
    () => {
      if (!popover.hidden) popover.hidden = true;
    },
    { passive: true }
  );
})();
