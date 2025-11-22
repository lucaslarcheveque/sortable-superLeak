let heroes = [];
let currentPage = 1;
const tableBody = document.querySelector("#heroesTable tbody");

let filteredHeroes = [];
const searchInput = document.getElementById("search");

let pageSize = 20;
const pageSizeSelect = document.getElementById("pageSize");

let currentSortColumn = "name";
let currentSortOrder = "asc"; // "asc" ou "desc"

/*MARK: Fetch
	récupération des données*/
fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
	.then(response => response.json())
	.then(data => {
	heroes = data;
	filteredHeroes = heroes;
	sortHeroes("name"); // Tri initial par nom
});

/*MARK: Render table
	création du rendu en tableau*/
const renderTable = () => {
	tableBody.innerHTML = "";
	let start = (currentPage - 1) * pageSize;
	let end = pageSize === "all" ? filteredHeroes.length : start + pageSize;
	let pageData = filteredHeroes.slice(start, end);

	pageData.forEach(hero => {
		const row = document.createElement("tr");
		row.innerHTML = `
		<td><img src="${hero.images.xs}" alt="${hero.name}"></td>
		<td>${hero.name}</td>
		<td>${hero.biography.fullName || ""}</td>
		<td>${Object.entries(hero.powerstats).map(([key,value]) => `${key}: ${value}`).join(", ")}</td>
		<td>${hero.appearance.race || ""}</td>
		<td>${hero.appearance.gender || ""}</td>
		<td>${hero.appearance.height.join(" / ")}</td>
		<td>${hero.appearance.weight.join(" / ")}</td>
		<td>${hero.biography.placeOfBirth || ""}</td>
		<td>${hero.biography.alignment || ""}</td>
		`;
		tableBody.appendChild(row);
	});
};

/*MARK: Sort
	fonction de tri*/
const sortHeroes = (column) => {
	// Si on clique sur la même colonne, on inverse l'ordre
	if (currentSortColumn === column) {
		currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
	} else {
		// Nouvelle colonne, on commence par ordre croissant
		currentSortColumn = column;
		currentSortOrder = "asc";
	}

	// Fonction pour obtenir la valeur à comparer
	const getValue = (hero, column) => {
		let value = "";
		switch(column) {
			case "name":
				value = hero.name || "";
				break;
			case "fullName":
				value = hero.biography.fullName || "";
				break;
			case "race":
				value = hero.appearance.race || "";
				break;
			case "gender":
				value = hero.appearance.gender || "";
				break;
			case "height":
				value = hero.appearance.height || [];
				break;
			case "weight":
				value = hero.appearance.weight || [];
				break;
			case "placeOfBirth":
				value = hero.biography.placeOfBirth || "";
				break;
			case "alignment":
				value = hero.biography.alignment || "";
				break;
			default:
				value = "";
		}
		
		// Traiter "-" comme une valeur vide
		if (value === "-") {
			value = "";
		}
		
		return value;
	};

	// Tri des héros
	filteredHeroes.sort((a, b) => {
		let valA = getValue(a, column);
		let valB = getValue(b, column);

		// Si c'est Height ou Weight, extraire les valeurs numériques
		if (column === "height" || column === "weight") {
			// Extraire le nombre (cm pour height, kg pour weight)
			const extractNumber = (arr, column) => {
				if (!arr || arr.length === 0) return null;
				
				// Les données sont : ["5'11", "180 cm"] ou ["181 lb", "82 kg"]
				// Pour height : index 1 contient "180 cm"
				// Pour weight : index 1 contient "82 kg"
				let str = arr[1] || "";
				
				// Si c'est juste "-", traiter comme vide
				if (str === "-" || str.trim() === "") return null;
				
				// Pour height : chercher les cm ou meters
				if (column === "height") {
					// Chercher "X.XX meters" ou "X.XX m"
					let metersMatch = str.match(/([\d.]+)\s*(?:meters?|m)\b/i);
					if (metersMatch) {
						let number = parseFloat(metersMatch[1]);
						if (number === 0) return null;
						return number * 100; // convertir en cm
					}
					
					// Sinon chercher "X cm"
					let cmMatch = str.match(/([\d.]+)\s*cm\b/i);
					if (cmMatch) {
						let number = parseFloat(cmMatch[1]);
						if (number === 0) return null;
						return number;
					}
					return null;
				}
				
				// Pour weight : chercher les kg ou tonnes
				if (column === "weight") {
					// Chercher "X tons" ou "X tonnes"
					let tonsMatch = str.match(/([\d.]+)\s*(?:tons?|tonnes?)\b/i);
					if (tonsMatch) {
						let number = parseFloat(tonsMatch[1]);
						if (number === 0) return null;
						return number * 1000; // convertir en kg
					}
					
					// Sinon chercher "X kg"
					let kgMatch = str.match(/([\d.]+)\s*kg\b/i);
					if (kgMatch) {
						let number = parseFloat(kgMatch[1]);
						if (number === 0) return null;
						return number;
					}
					return null;
				}
				
				return null;
			};

			valA = extractNumber(valA, column);
			valB = extractNumber(valB, column);

			// Gérer les valeurs vides (null)
			if (valA === null && valB === null) return 0;
			if (valA === null) return currentSortOrder === "asc" ? 1 : -1;
			if (valB === null) return currentSortOrder === "asc" ? -1 : 1;

			// Comparaison numérique
			if (currentSortOrder === "asc") {
				return valA - valB;
			} else {
				return valB - valA;
			}
		} else {
			// Tri alphabétique pour les autres colonnes
			valA = valA.toLowerCase();
			valB = valB.toLowerCase();

			// Gérer les valeurs vides
			if (valA === "" && valB === "") return 0;
			if (valA === "") return currentSortOrder === "asc" ? 1 : -1;
			if (valB === "") return currentSortOrder === "asc" ? -1 : 1;

			// Comparaison normale
			if (currentSortOrder === "asc") {
				return valA.localeCompare(valB);
			} else {
				return valB.localeCompare(valA);
			}
		}
	});

	// Mettre à jour les flèches visuelles
	document.querySelectorAll(".sort-arrow").forEach(arrow => {
		arrow.className = "sort-arrow";
	});
	const activeHeader = document.querySelector(`th[data-column="${column}"] .sort-arrow`);
	if (activeHeader) {
		activeHeader.classList.add(currentSortOrder);
	}

	currentPage = 1;
	renderTable();
};

/*MARK: Search
	barre de recherche*/
searchInput.addEventListener("input", () => {
	const typing = searchInput.value.toLowerCase();
	filteredHeroes = heroes.filter(h => h.name.toLowerCase().includes(typing));
	currentPage = 1;
	renderTable();
});

/*MARK: Page size
	sélection de la pagination*/
pageSizeSelect.addEventListener("change", () => {
	pageSize = pageSizeSelect.value === "all" ? "all" : parseInt(pageSizeSelect.value);
	currentPage = 1;
	renderTable();
});

/*MARK: Sort listeners
	écoute des clics sur les en-têtes*/
// On attend que le DOM soit chargé
window.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll("th[data-column]").forEach(th => {
		th.addEventListener("click", () => {
			const column = th.getAttribute("data-column");
			sortHeroes(column);
		});
	});
});