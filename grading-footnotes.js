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
    src.textContent = criteria.sourceNote;
    footnote.appendChild(document.createElement("br"));
    footnote.appendChild(src);
  }
})();
