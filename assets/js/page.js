import { store } from "./store.js";
import { renderTable } from "./rendertable.js";

const paginationContainer = document.getElementById("pagination");

export function updatePagination(tableBody) {
  renderTable(tableBody);
  renderPaginationButtons(tableBody);
}

function renderPaginationButtons(tableBody) {
  paginationContainer.innerHTML = "";

  if (store.pageSize === "all") return; // pas de pagination si all

  const totalItems = store.filteredHeroes.length;
  const ps = store.pageSize === "all" ? totalItems : store.pageSize;
  const totalPages = Math.ceil(totalItems / ps);

  // Bouton Prev
  const prev = document.createElement("button");
  prev.textContent = "Prev";
  prev.disabled = store.currentPage === 1;
  prev.onclick = () => {
    store.currentPage--;
    updatePagination(tableBody);
  };
  paginationContainer.appendChild(prev);

  // totalité des Numéros
  /*for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (i === store.currentPage) btn.style.fontWeight = "bold";

    btn.onclick = () => {
      store.currentPage = i;
      updatePagination(tableBody);
    };
    paginationContainer.appendChild(btn);
  }*/

	// Pages avec ellipse :  '1' '2' '3' ... '57'-------------------------
	// d'abord 2 sous-fonctions:
	function addPageButton(page, tableBody) {
		const btn = document.createElement("button");
		btn.textContent = page;
		if (page === store.currentPage) btn.classList.add("active");
		btn.onclick = () => {
			store.currentPage = page;
			updatePagination(tableBody);
		};
		paginationContainer.appendChild(btn);
	}

	function addEllipsis() {
		const span = document.createElement("span");
		span.textContent = "...";
		span.style.margin = "0 4px";
		paginationContainer.appendChild(span);
	}

	const maxVisible = 5; // nombre de pages visibles autour de la courante
	const current = store.currentPage;

	// Toujours afficher la première
	addPageButton(1, tableBody);

	if (current > maxVisible) addEllipsis();

	const start = Math.max(2, current - 2);
	const end = Math.min(totalPages - 1, current + 2);
	for (let i = start; i <= end; i++) {
		addPageButton(i, tableBody);
	}

	if (current < totalPages - maxVisible) addEllipsis();

	// Toujours afficher la dernière
	if (totalPages > 1) addPageButton(totalPages, tableBody);
	//---------------------------------------------------------------------


  // Bouton Next
  const next = document.createElement("button");
  next.textContent = "Next";
  next.disabled = store.currentPage === totalPages;
  next.onclick = () => {
    store.currentPage++;
    updatePagination(tableBody);
  };
  paginationContainer.appendChild(next);
}
