import { store } from "./store.js";

export const renderTable = (tableBody) => {
	tableBody.innerHTML = "";
	let start = (store.currentPage - 1) * store.pageSize;
	let end = store.pageSize === "all" ? store.filteredHeroes.length : start + store.pageSize;
	let pageData = store.filteredHeroes.slice(start, end);

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
