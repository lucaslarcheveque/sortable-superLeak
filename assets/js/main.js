import { store } from "./store.js";
import { renderTable } from "./rendertable.js";
import { applySearch } from "./search.js";
import { sortHeroes } from "./sort.js";
import { updatePagination } from "./page.js";

export const tableBody = document.querySelector("#heroesTable tbody");
export const searchInput = document.getElementById("search");
export const pageSizeSelect = document.getElementById("pageSize");


/*MARK: Fetch
	récupération des données*/
fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
	.then(response => response.json())
	.then(data => {
		store.heroes = data;
		console.log("nombre total d'entrées: " + store.heroes.length);
		store.filteredHeroes = store.heroes;
		sortHeroes("name", tableBody); // Tri initial par nom
		applySearch(searchInput, tableBody);
		updatePagination(tableBody);
});


/*MARK: Sort listeners
	écoute des clics sur les en-têtes*/
// On attend que le DOM soit chargé
window.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll("th[data-column]").forEach(th => {
		th.addEventListener("click", () => {
			const column = th.getAttribute("data-column");
			sortHeroes(column, tableBody);
		});
	});
});

/*MARK: Page size
	sélection de la pagination*/
pageSizeSelect.addEventListener("change", () => {
	store.pageSize = pageSizeSelect.value === "all" ? "all" : parseInt(pageSizeSelect.value);
	store.currentPage = 1;
	renderTable(tableBody);
	applySearch(searchInput, tableBody);
	updatePagination(tableBody);
});