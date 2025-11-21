let heroes = [];
let currentPage = 1;
const tableBody = document.querySelector("#heroesTable tbody");

let filteredHeroes = [];
const searchInput = document.getElementById("search");

let pageSize = 20;
const pageSizeSelect = document.getElementById("pageSize");


/*MARK: Fetch
	récupération des données*/
fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
	.then(response => response.json())
	.then(data => {
		heroes = data;
		filteredHeroes = heroes;
		renderTable();
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
