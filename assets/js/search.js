import { store } from "./store.js";
import { renderTable } from "./rendertable.js";

export const applySearch = (searchInput, tableBody) => {

	searchInput.addEventListener("input", () => {
		const typing = searchInput.value.toLowerCase();

		store.filteredHeroes = store.heroes.filter(h => {
			// Concaténer les champs pertinents en une seule chaîne
			const searchableInput = [
				h.name,
				h.biography.fullName,
				h.biography.placeOfBirth,
				h.biography.alignment,
				h.appearance.gender,
				h.appearance.race,
				h.appearance.height.join(" "),
				h.appearance.weight.join(" "),
				Object.values(h.powerstats).join(" ")
			]
			.filter(Boolean) // enlever les champs vides/null
			.join(" ")
			.toLowerCase();

			return searchableInput.includes(typing);
		});
		console.log("nombre d'entrées filtrées: " + store.filteredHeroes.length);

		store.currentPage = 1; //on remet la pagination à 1
		renderTable(tableBody);
	});
};