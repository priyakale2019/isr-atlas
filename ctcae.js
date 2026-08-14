(() => {
  const data = window.CTCAE_ISR;
  const morph = window.MORPH_LINKS;
  const root = document.getElementById("ctcae-table-root");
  const defEl = document.getElementById("ctcae-definition");
  const sourceEl = document.getElementById("ctcae-source");
  if (!data || !morph || !root) return;

  const { linkMorphologyTerms, bindTermInteractions, escapeHtml } = morph;

  function renderCell(text) {
    const td = document.createElement("td");
    td.innerHTML = linkMorphologyTerms(text);
    return td;
  }

  const table = document.createElement("table");
  table.className = "daids-table ctcae-table";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  data.columns.forEach((col) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = col.label;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  const tr = document.createElement("tr");
  const eventTh = document.createElement("th");
  eventTh.scope = "row";
  eventTh.innerHTML = `<span class="daids-param">${linkMorphologyTerms(data.row.event)}</span>`;
  tr.appendChild(eventTh);
  ["grade1", "grade2", "grade3", "grade4", "grade5"].forEach((key) => {
    tr.appendChild(renderCell(data.row[key]));
  });
  tbody.appendChild(tr);
  table.appendChild(tbody);
  root.appendChild(table);

  bindTermInteractions(root);

  if (defEl) {
    defEl.innerHTML = `<strong>Definition:</strong> ${linkMorphologyTerms(data.definition)}`;
    bindTermInteractions(defEl);
  }
  if (sourceEl && data.sourceNote) {
    if (data.sourceUrl) {
      const a = document.createElement("a");
      a.className = "source-term-link";
      a.href = data.sourceUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "CTCAE";
      sourceEl.replaceChildren(a, document.createTextNode(` — ${data.sourceNote}`));
    } else {
      sourceEl.textContent = data.sourceNote;
    }
  }
})();
