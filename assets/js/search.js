import { renderTable } from "./rendertable.js";

const applySearch = (searchInput, heroes, tableBody, currentPage, pageSize) => {
	let filteredHeroes = heroes;

	searchInput.addEventListener("input", () => {
		const typing = searchInput.value.toLowerCase();

		filteredHeroes = heroes.filter(h => {
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
		console.log("nombre d'entrées filtrées: " + filteredHeroes.length);

		currentPage = 1; //on remet la pagination à 1
		renderTable(filteredHeroes, tableBody, currentPage, pageSize);
	});

	//return () => filteredHeroes;
}

export { applySearch };