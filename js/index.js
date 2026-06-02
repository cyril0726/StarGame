// BOOT
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("boot")?.remove();
  }, 2000);
});

document.addEventListener("DOMContentLoaded", () => {

	// CACHE DOM (ICI et pas en haut)
	const sections = document.querySelectorAll(".section");
	const navItems = document.querySelectorAll("[data-section]");

	// NAVIGATION
	function showSection(id){
		sections.forEach(s =>
		s.classList.toggle("active", s.id === id)
		);

		navItems.forEach(btn =>
		btn.classList.toggle("active", btn.dataset.section === id)
		);

		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	// EVENTS
	navItems.forEach(btn => {
		btn.addEventListener("click", () => {
			showSection(btn.dataset.section);

			// Si le menu hamburger est ouvert, on le ferme
			if (navLinks.classList.contains("active")) {
			navLinks.classList.remove("active");
			hamburger.textContent = "☰"; // remettre l'icône hamburger
			}
		});
	});

  // INIT
  showSection("home");
});

//Hamburger
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.textContent =
        navLinks.classList.contains("active")
        ? "✕"
        : "☰";
});