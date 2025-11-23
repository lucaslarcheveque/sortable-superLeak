import { store } from "./store.js";
import { renderTable } from "./rendertable.js";


/*MARK: Sort
	fonction de tri*/
export const sortHeroes = (column, tableBody) => {
	// Si on clique sur la même colonne, on inverse l'ordre
	if (store.currentSortColumn === column) {
		store.currentSortOrder = store.currentSortOrder === "asc" ? "desc" : "asc";
	} else {
		// Nouvelle colonne, on commence par ordre croissant
		store.currentSortColumn = column;
		store.currentSortOrder = "asc";
	}

	/*MARK: getValue
	*/
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
			case "powerStats":
				// Additionner toutes les valeurs numériques
				const stats = hero.powerstats || {};
				value = Object.values(stats).reduce((sum, v) => {
					const num = parseFloat(v);
					return sum + (isNaN(num) ? 0 : num);
				}, 0);
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

	/*MARK: tri
	*/
	// Tri des héros
	store.filteredHeroes.sort((a, b) => {
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
					// enlever les séparateurs de milliers "," ("90,000 tons")
  					str = str.replace(/,/g, "");
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
			if (valA === null) return store.currentSortOrder === "asc" ? 1 : -1;
			if (valB === null) return store.currentSortOrder === "asc" ? -1 : 1;

			// Comparaison numérique
			if (store.currentSortOrder === "asc") {
				return valA - valB;
			} else {
				return valB - valA;
			}
		} else if (column === "powerStats") {
			// Comparaison numérique
			if (store.currentSortOrder === "asc") {
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
			if (valA === "") return store.currentSortOrder === "asc" ? 1 : -1;
			if (valB === "") return store.currentSortOrder === "asc" ? -1 : 1;

			// Comparaison normale
			if (store.currentSortOrder === "asc") {
				return valA.localeCompare(valB);
			} else {
				return valB.localeCompare(valA);
			}
		}
	});

	// réaffichage avec les paramètres reçus
	renderTable(tableBody);

	/*MARK: flèches
	*/
	// Mettre à jour les flèches visuelles
	document.querySelectorAll(".sort-arrow").forEach(arrow => {
		arrow.className = "sort-arrow";
	});
	// Mettre à jour la colonne active
	document.querySelectorAll("#heroesTable th").forEach(th => {
		th.classList.remove("sorted"); // enlever la mise en valeur partout
	});
	/*const activeHeader = document.querySelector(`th[data-column="${column}"] .sort-arrow`);
	if (activeHeader) {
		activeHeader.classList.add(store.currentSortOrder);
	}*/
	const activeTh = document.querySelector(`#heroesTable th[data-column="${column}"]`);
	const activeArrow = activeTh.querySelector(".sort-arrow");
	if (activeArrow) {
		activeArrow.classList.add(store.currentSortOrder); // asc ou desc
		activeTh.classList.add("sorted"); // mettre en valeur la colonne
	}
};