export const openHeroModal = (hero) => {
	const modal = document.getElementById("heroModal");
	const modalBody = document.getElementById("modalBody");

	modalBody.innerHTML = `
		<h2>${hero.name}</h2>
		<img src="${hero.images.lg}" alt="${hero.name}" style="max-width:200px;">
		<h3>Biography</h3>
		<p><strong>Full Name:</strong> ${hero.biography.fullName}</p>
		<p><strong>Place of Birth:</strong> ${hero.biography.placeOfBirth}</p>
		<p><strong>First Appearance:</strong> ${hero.biography.firstAppearance}</p>
		<p><strong>Publisher:</strong> ${hero.biography.publisher}</p>
		<p><strong>Alignment:</strong> ${hero.biography.alignment}</p>

		<h3>Powerstats</h3>
		<ul>
		${Object.entries(hero.powerstats).map(([k,v]) => `<li>${k}: ${v}</li>`).join("")}
		</ul>

		<h3>Appearance</h3>
		<p>Gender: ${hero.appearance.gender}</p>
		<p>Race: ${hero.appearance.race || ""}</p>
		<p>Height: ${hero.appearance.height.join(" / ")}</p>
		<p>Weight: ${hero.appearance.weight.join(" / ")}</p>
		<p>Eye Color: ${hero.appearance.eyeColor}</p>
		<p>Hair Color: ${hero.appearance.hairColor}</p>

		<h3>Work</h3>
		<p>Occupation: ${hero.work.occupation}</p>
		<p>Base: ${hero.work.base}</p>

		<h3>Connections</h3>
		<p>Group Affiliation: ${hero.connections.groupAffiliation}</p>
		<p>Relatives: ${hero.connections.relatives}</p>
	`;

	modal.style.display = "block";

	document.getElementById("closeModal").onclick = () => {
		modal.style.display = "none";
	};

	window.onclick = (event) => {
		if (event.target === modal) {
			modal.style.display = "none";
		}
	};
};
