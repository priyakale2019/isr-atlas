(() => {
  const data = window.MEDDRA_GLOSSARY;
  const root = document.getElementById("glossary-list");
  const search = document.getElementById("glossary-search");
  const count = document.getElementById("glossary-count");
  const source = document.getElementById("glossary-source");
  if (!data || !root) return;

  if (source && data.source) source.textContent = data.source;

  let terms = [...(data.terms || [])];

  function render(list) {
    root.innerHTML = "";
    list.forEach((term) => {
      const li = document.createElement("li");
      li.className = "glossary-term";
      li.textContent = term;
      root.appendChild(li);
    });
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
