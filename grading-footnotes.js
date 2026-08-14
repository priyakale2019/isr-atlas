(() => {
  const footnote = document.getElementById("daids-footnote");
  const criteria = window.DAIDS_CRITERIA;
  if (!footnote || !criteria) return;

  if (criteria.footnote) {
    footnote.textContent = `¹² ${criteria.footnote}`;
  }
  if (criteria.sourceNote) {
    const src = document.createElement("span");
    src.className = "daids-source";
    if (criteria.sourceUrl) {
      const a = document.createElement("a");
      a.className = "source-term-link";
      a.href = criteria.sourceUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "DAIDS";
      src.appendChild(a);
      src.appendChild(document.createTextNode(` — ${criteria.sourceNote}`));
    } else {
      src.textContent = criteria.sourceNote;
    }
    footnote.appendChild(document.createElement("br"));
    footnote.appendChild(src);
  }
})();
