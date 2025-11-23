import { store } from "./store.js";
import { openHeroModal } from "./modal.js";

export const renderTable = (tableBody) => {
	tableBody.innerHTML = "";
	let start = (store.currentPage - 1) * store.pageSize;
	let end = store.pageSize === "all" ? store.filteredHeroes.length : start + store.pageSize;
	let pageData = store.filteredHeroes.slice(start, end);

	pageData.forEach(hero => {
		const row = document.createElement("tr");

	// sous-tableau pour powerstats
		const powerstatsTable = `
		<table class="inner-table">
			${Object.entries(hero.powerstats).map(([key, value]) => `
			<tr>
				<td>${key}</td>
				<td>${value}</td>
			</tr>
			`).join("")}
		</table>
		`;
		// sous-tableau pour height
		const heightTable = `
		<table class="inner-table">
			<tr><td>Imperial</td><td>${hero.appearance.height[0] || ""}</td></tr>
			<tr><td>Metric</td><td>${hero.appearance.height[1] || ""}</td></tr>
		</table>
		`;
		// sous-tableau pour weight
		const weightTable = `
		<table class="inner-table">
			<tr><td>Imperial</td><td>${hero.appearance.weight[0] || ""}</td></tr>
			<tr><td>Metric</td><td>${hero.appearance.weight[1] || ""}</td></tr>
		</table>
		`;

		row.innerHTML = `
		<td><img src="${hero.images.xs}" alt="${hero.name}"></td>
		<td class="hero-name">${hero.name}</td>
		<td>${hero.biography.fullName || ""}</td>
		<td>${powerstatsTable}</td>
		<td>${hero.appearance.race || ""}</td>
		<td>${hero.appearance.gender || ""}</td>
		<td>${heightTable}</td>
		<td>${weightTable}</td>
		<td>${hero.biography.placeOfBirth || ""}</td>
		<td>${hero.biography.alignment || ""}</td>
		`;
		tableBody.appendChild(row);

		const nameCell = row.querySelector("td:nth-child(2)");
		if (nameCell) {
			nameCell.addEventListener("click", () => openHeroModal(hero));
		};
	});
};
