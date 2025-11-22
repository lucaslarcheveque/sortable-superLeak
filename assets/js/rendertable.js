export const renderTable = (filteredHeroes, tableBody, currentPage, pageSize) => {
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
