const header = document.querySelector("[data-project-nav]");
const heroArt = document.querySelector("[data-project-art]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelector("[data-year]").textContent = new Date().getFullYear();

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 18);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (heroArt && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  const stage = heroArt.firstElementChild;
  heroArt.addEventListener("pointermove", event => {
    const bounds = heroArt.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    stage.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
    stage.style.setProperty("--ry", `${(x * 9).toFixed(2)}deg`);
  });
  heroArt.addEventListener("pointerleave", () => {
    stage.style.setProperty("--rx", "0deg");
    stage.style.setProperty("--ry", "0deg");
  });
}

if (reduceMotion || !("IntersectionObserver" in window)) {
  document.querySelectorAll(".reveal").forEach(element => element.classList.add("visible"));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -35px" });
  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
}
