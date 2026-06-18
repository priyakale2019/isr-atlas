(() => {
  const criteria = window.DAIDS_CRITERIA;
  const morph = window.MORPH_LINKS;
  const root = document.getElementById("daids-table-root");
  if (!criteria || !morph || !root) return;

  const { linkMorphologyTerms, bindTermInteractions, escapeHtml } = morph;

  function renderCell(text) {
    const td = document.createElement("td");
    td.innerHTML = linkMorphologyTerms(text);
    return td;
  }

  function renderTable() {
    const table = document.createElement("table");
    table.className = "daids-table";
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    criteria.columns.forEach((col) => {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = col.label;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    criteria.rows.forEach((row) => {
      if (row.subrows) {
        const groupRow = document.createElement("tr");
        groupRow.className = "daids-group-row";
        const th = document.createElement("th");
        th.scope = "rowgroup";
        th.innerHTML = `<span class="daids-param">${linkMorphologyTerms(row.parameter)}</span>`;
        if (row.note) th.innerHTML += `<span class="daids-note">${escapeHtml(row.note)}</span>`;
        groupRow.appendChild(th);
        for (let i = 0; i < 4; i++) {
          const td = document.createElement("td");
          td.className = "daids-group-pad";
          td.setAttribute("aria-hidden", "true");
          groupRow.appendChild(td);
        }
        tbody.appendChild(groupRow);

        row.subrows.forEach((sub) => {
          const tr = document.createElement("tr");
          const param = document.createElement("th");
          param.scope = "row";
          param.className = "daids-subparam";
          param.textContent = sub.label;
          tr.appendChild(param);
          ["grade1", "grade2", "grade3", "grade4"].forEach((key) => {
            tr.appendChild(renderCell(sub.cells[key]));
          });
          tbody.appendChild(tr);
        });
      } else {
        const tr = document.createElement("tr");
        const param = document.createElement("th");
        param.scope = "row";
        param.innerHTML = `<span class="daids-param">${linkMorphologyTerms(row.parameter)}</span>`;
        if (row.note) param.innerHTML += `<span class="daids-note">${escapeHtml(row.note)}</span>`;
        tr.appendChild(param);
        ["grade1", "grade2", "grade3", "grade4"].forEach((key) => {
          tr.appendChild(renderCell(row.cells[key]));
        });
        tbody.appendChild(tr);
      }
    });

    table.appendChild(tbody);
    root.appendChild(table);
    bindTermInteractions(root);
  }

  renderTable();
})();
