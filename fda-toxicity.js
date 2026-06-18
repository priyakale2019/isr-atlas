(() => {
  const data = window.FDA_TOXICITY_ISR;
  const morph = window.MORPH_LINKS;
  const root = document.getElementById("fda-table-root");
  const footnotesEl = document.getElementById("fda-footnotes");
  const sourceEl = document.getElementById("fda-source");
  if (!data || !morph || !root) return;

  const { linkMorphologyTerms, bindTermInteractions } = morph;

  function renderCell(text) {
    const td = document.createElement("td");
    td.innerHTML = linkMorphologyTerms(text);
    return td;
  }

  const table = document.createElement("table");
  table.className = "daids-table fda-table";

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
  data.rows.forEach((row) => {
    const tr = document.createElement("tr");
    const param = document.createElement("th");
    param.scope = "row";
    const label = row.marker
      ? `${linkMorphologyTerms(row.parameter)}<span class="fda-marker" aria-hidden="true">${row.marker}</span>`
      : linkMorphologyTerms(row.parameter);
    param.innerHTML = `<span class="daids-param">${label}</span>`;
    tr.appendChild(param);
    ["grade1", "grade2", "grade3", "grade4"].forEach((key) => {
      tr.appendChild(renderCell(row.cells[key]));
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  root.appendChild(table);
  bindTermInteractions(root);

  if (footnotesEl && data.footnotes?.length) {
    const list = document.createElement("ul");
    list.className = "fda-footnotes-list";
    data.footnotes.forEach((note) => {
      const li = document.createElement("li");
      li.innerHTML = linkMorphologyTerms(note);
      list.appendChild(li);
    });
    footnotesEl.appendChild(list);
    bindTermInteractions(footnotesEl);
  }

  if (sourceEl && data.sourceNote) {
    sourceEl.textContent = data.sourceNote;
  }
})();
