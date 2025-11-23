const paginationContainer = document.getElementById("pagination");

function updatePagination() {
  renderTable();
  renderPaginationButtons();
}

function renderPaginationButtons() {
  paginationContainer.innerHTML = "";

  if (pageSize === "all") return; // pas de pagination si all

  const totalItems = filteredHeroes.length;
  const ps = pageSize === "all" ? totalItems : pageSize;
  const totalPages = Math.ceil(totalItems / ps);

  // Bouton Prev
  const prev = document.createElement("button");
  prev.textContent = "Prev";
  prev.disabled = currentPage === 1;
  prev.onclick = () => {
    currentPage--;
    updatePagination();
  };
  paginationContainer.appendChild(prev);

  // Numéros
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (i === currentPage) btn.style.fontWeight = "bold";

    btn.onclick = () => {
      currentPage = i;
      updatePagination();
    };
    paginationContainer.appendChild(btn);
  }

  // Bouton Next
  const next = document.createElement("button");
  next.textContent = "Next";
  next.disabled = currentPage === totalPages;
  next.onclick = () => {
    currentPage++;
    updatePagination();
  };
  paginationContainer.appendChild(next);
}
