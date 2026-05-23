// BOOT
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("boot")?.remove();
  }, 2000);
});

// CACHE DOM
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
  });
});

// INIT
document.addEventListener("DOMContentLoaded", () => {
  showSection("home");
});